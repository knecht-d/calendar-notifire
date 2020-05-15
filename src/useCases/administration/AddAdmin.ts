import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, MessageKey } from "../interfaces";
import { UseCase } from "../UseCase";
import { convertChatToPersistence } from "../utils";

export interface IAddAdminInput {
    userId: string;
    chatId: string;
    adminId: string;
}

export abstract class AddAdmin extends UseCase<IAddAdminInput> {}

export class AddAdminImpl extends AddAdmin {
    constructor(private communication: ICommunication, private persistence: IChatConfigSaver) {
        super();
    }

    public execute({ chatId, userId, adminId }: IAddAdminInput) {
        const chat = Chats.instance.getChat(chatId);
        chat.addAdmin(userId, adminId);
        this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
        this.communication.send(chatId, { key: MessageKey.ADD_ADMIN, newAdmin: adminId });
    }
}
