import { Chats } from "../../entities";
import { IChatPersistence } from "../types";
import { UseCase } from "../UseCase";
import { convertChatToPersistence } from "../utils";

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

export abstract class InitializeChat extends UseCase<IInitInput> {}

export class InitializeChatImpl extends InitializeChat {
    constructor(private communication: IInitCommunication, private persistence: IInitChatPersistence) {
        super();
    }

    public execute({ chatId, userId }: IInitInput) {
        const chat = Chats.instance.createChat(chatId, [userId]);
        this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
        this.communication.sendInitSuccess(chatId);
    }
}
