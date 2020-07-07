import { Chats, TimeFrame } from "../../entities";
import {
    IChatConfigSaver,
    ICommunication,
    IPersistedRecurrenceRule,
    ITimeFrameSettings,
    ITimerSetter,
    MessageKey,
} from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertChatToPersistence, createRecurrence } from "../utils";

export interface ISetConfigInput {
    userId: string;
    chatId: string;
    triggerId: string;
    config: {
        recurrence: IPersistedRecurrenceRule;
        frame: {
            begin: ITimeFrameSettings;
            end: ITimeFrameSettings;
        };
    };
}

export abstract class SetConfig extends UseCase<ISetConfigInput> {}
export class SetConfigImpl extends SetConfig {
    constructor(
        logger: IUseCaseLogger,
        private communication: ICommunication,
        private timerSettings: ITimerSetter,
        private persistence: IChatConfigSaver,
    ) {
        super(logger);
    }

    @logExecute()
    execute({ chatId, userId, triggerId, config }: ISetConfigInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.getChat(chatId);
                const timeFrame = new TimeFrame(config.frame.begin, config.frame.end);
                const recurrence = createRecurrence(config.recurrence);
                chat.setTrigger(triggerId, { frame: timeFrame, recurrence: recurrence }, userId);
                this.timerSettings.set(chatId, triggerId, config.recurrence);
                this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
                this.communication.send(chatId, { key: MessageKey.SET_CONFIG, triggerId });
            } catch (error) {
                this.logger.warn("SetConfigImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.SET_CONFIG,
                    triggerId,
                    message: `{${error.key}}`,
                });
            }
            resolve();
        });
    }
}
