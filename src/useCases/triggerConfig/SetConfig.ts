import { Chats, TimeFrame } from "../../entities";
import { IChatPersistence, IPersistedRecurrenceRule, ITimeFrameSettings } from "../types";
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

export interface ISetTimer {
    set: (chatId: string, triggerId: string, recurrence: IPersistedRecurrenceRule) => void;
}

export interface IUpdateChatPersistence {
    saveChatConfig: (chatId: string, chat: IChatPersistence) => void;
}

export abstract class SetConfig extends UseCase<ISetConfigInput> {}
export class SetConfigImpl extends SetConfig {
    constructor(
        private communication: ISetConfigCommunication,
        private timerSettings: ISetTimer,
        private persistence: IUpdateChatPersistence,
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
