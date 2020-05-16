import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, MessageKey } from "../interfaces";
import { UseCase } from "../UseCase";
import { convertChatToPersistence } from "../utils";

export interface IRemoveAdminInput {
    userId: string;
    chatId: string;
    adminId: string;
}

export abstract class RemoveAdmin extends UseCase<IRemoveAdminInput> {}

export class RemoveAdminImpl extends RemoveAdmin {
    constructor(private communication: ICommunication, private persistence: IChatConfigSaver) {
        super();
    }

    public execute({ chatId, userId, adminId }: IRemoveAdminInput) {
        return new Promise<void>(resolve => {
            const chat = Chats.instance.getChat(chatId);
            chat.removeAdmin(userId, adminId);
            this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
            this.communication.send(chatId, { key: MessageKey.REMOVE_ADMIN, oldAdmin: adminId });
            resolve();
        });
    }
}
