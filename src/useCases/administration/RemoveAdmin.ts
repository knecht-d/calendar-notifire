import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertChatToPersistence, toText } from "../utils";

export interface IRemoveAdminInput {
    userId: string;
    chatId: string;
    adminId: string;
}

export abstract class RemoveAdmin extends UseCase<IRemoveAdminInput> {}

export class RemoveAdminImpl extends RemoveAdmin {
    constructor(logger: IUseCaseLogger, private communication: ICommunication, private persistence: IChatConfigSaver) {
        super(logger);
    }

    @logExecute()
    execute({ chatId, userId, adminId }: IRemoveAdminInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.getChat(chatId);
                chat.removeAdmin(userId, adminId);
                this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
                this.communication.send(chatId, { key: MessageKey.REMOVE_ADMIN, oldAdmin: adminId });
            } catch (error) {
                this.logger.warn("RemoveAdminImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.REMOVE_ADMIN,
                    oldAdmin: adminId,
                    message: toText(error.key),
                });
            }
            resolve();
        });
    }
}
