import { Chats } from "../../entities";
import { IChatPersistence } from "../interfaces";
import { UseCase } from "../UseCase";

export interface IDeleteConfigInput {
    userId: string;
    chatId: string;
    triggerId: string;
}

export interface IDeleteConfigCommunication {
    sendDeleteConfigSuccess: (chatId: string, triggerId: string, message?: string) => void;
    sendDeleteConfigError: (chatId: string, triggerId: string, message?: string) => void;
}

export interface IDeleteConfigTimer {
    stop: (chatId: string, triggerId: string) => void;
}

export interface IDeleteConfigChatPersistence {
    saveChatConfig: (chatId: string, chat: IChatPersistence) => void;
}

export abstract class DeleteConfig extends UseCase<IDeleteConfigInput> {}
export class DeleteConfigImpl extends DeleteConfig {
    constructor(
        private communication: IDeleteConfigCommunication,
        private timerSettings: IDeleteConfigTimer,
        private persistence: IDeleteConfigChatPersistence,
    ) {
        super();
    }

    public execute({ chatId, userId, triggerId }: IDeleteConfigInput) {
        const chat = Chats.instance.getChat(chatId);
        chat.removeTimeFrame(triggerId, userId);
        this.timerSettings.stop(chatId, triggerId);
        this.persistence.saveChatConfig(chatId, chat.toJSON());
        this.communication.sendDeleteConfigSuccess(chatId, triggerId);
    }
}
