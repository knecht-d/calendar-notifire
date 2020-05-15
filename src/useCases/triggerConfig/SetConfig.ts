import { Chats, TimeFrame } from "../../entities";
import {
    IChatConfigSaver,
    ICommunication,
    IPersistedRecurrenceRule,
    ITimeFrameSettings,
    ITimerSetter,
    MessageKey,
} from "../interfaces";
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

export abstract class SetConfig extends UseCase<ISetConfigInput> {}
export class SetConfigImpl extends SetConfig {
    constructor(
        private communication: ICommunication,
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
        this.communication.send(chatId, { key: MessageKey.SET_CONFIG, triggerId });
    }
}
