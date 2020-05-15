import { Chats, TimeFrame } from "../../entities";
import { IChatConfigSaver, IPersistedRecurrenceRule, ITimeFrameSettings, ITimerSetter } from "../interfaces";
import { UseCase } from "../UseCase";
import { convertChatToPersistence, createRecurrence } from "../utils";

export interface ISetConfigInput {
    userId: string;
    chatId: string;
    triggerId: string;
    config: {
        recurrence: IPersistedRecurrenceRule;
        frameStart: ITimeFrameSettings;
        frameEnd: ITimeFrameSettings;
    };
}

export interface ISetConfigCommunication {
    sendSetConfigSuccess: (chatId: string, triggerId: string, message?: string) => void;
    sendSetConfigError: (chatId: string, triggerId: string, message?: string) => void;
}

export abstract class SetConfig extends UseCase<ISetConfigInput> {}
export class SetConfigImpl extends SetConfig {
    constructor(
        private communication: ISetConfigCommunication,
        private timerSettings: ITimerSetter,
        private persistence: IChatConfigSaver,
    ) {
        super();
    }

    public execute({ chatId, userId, triggerId, config }: ISetConfigInput) {
        const chat = Chats.instance.getChat(chatId);
        const timeFrame = new TimeFrame(config.frameStart, config.frameEnd);
        const recurrence = createRecurrence(config.recurrence);
        chat.setTimeFrame(triggerId, { frame: timeFrame, recurrence: recurrence }, userId);
        this.timerSettings.set(chatId, triggerId, config.recurrence);
        this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
        this.communication.sendSetConfigSuccess(chatId, triggerId);
    }
}
