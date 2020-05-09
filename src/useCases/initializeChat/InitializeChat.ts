import { Chats } from "../../entities";
import { IUseCase } from "../UseCase";
import { IChatPersistence } from "../updateConfig";

export interface IInitInput {
    userId: string;
    chatId: string;
}
export interface IInitChatPersistence {
    saveChatConfig: (chatId: string, chat: IChatPersistence) => void;
}

export interface IInitCommunication {
    sendInitSuccess: (chatId: string, message?: string) => void;
    sendInitError: (chatId: string, message?: string) => void;
}

export class InitializeChat implements IUseCase<IInitInput, void> {
    constructor(private communication: IInitCommunication, private persistence: IInitChatPersistence) {}

    public execute({ chatId, userId }: IInitInput) {
        const chat = Chats.instance.createChat(chatId, userId);
        this.persistence.saveChatConfig(chatId, chat.toJSON());
        this.communication.sendInitSuccess(chatId);
    }
}
