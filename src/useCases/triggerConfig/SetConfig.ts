import { Chats } from "../../entities";
import { IRecurrenceRule, ITimeFrameSettings } from "../../interfaces";
import { IChatPersistence } from "../interfaces";
import { UseCase } from "../UseCase";

export interface ISetConfigInput {
    userId: string;
    chatId: string;
    triggerId: string;
    config: {
        recurrence: IRecurrenceRule;
        frameStart: ITimeFrameSettings;
        frameEnd: ITimeFrameSettings;
    };
}

export interface ISetConfigCommunication {
    sendSetConfigSuccess: (chatId: string, triggerId: string, message?: string) => void;
    sendSetConfigError: (chatId: string, triggerId: string, message?: string) => void;
}

export interface ISetTimer {
    set: (chatId: string, triggerId: string, recurrence: IRecurrenceRule) => void;
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
        chat.setTimeFrame(
            triggerId,
            { begin: config.frameStart, end: config.frameEnd, recurrence: config.recurrence },
            userId,
        );
        this.timerSettings.set(chatId, triggerId, config.recurrence);
        this.persistence.saveChatConfig(chatId, chat.toJSON());
        this.communication.sendSetConfigSuccess(chatId, triggerId);
    }
}
