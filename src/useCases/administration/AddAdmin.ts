import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertChatToPersistence } from "../utils";

export interface IAddAdminInput {
    userId: string;
    chatId: string;
    adminId: string;
}

export abstract class AddAdmin extends UseCase<IAddAdminInput> {}

export class AddAdminImpl extends AddAdmin {
    constructor(logger: IUseCaseLogger, private communication: ICommunication, private persistence: IChatConfigSaver) {
        super(logger);
    }

    @logExecute()
    execute({ chatId, userId, adminId }: IAddAdminInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.getChat(chatId);
                chat.addAdmin(userId, adminId);
                this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
                this.communication.send(chatId, { key: MessageKey.ADD_ADMIN, newAdmin: adminId });
            } catch (error) {
                this.logger.warn("AddAdminImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.ADD_ADMIN,
                    newAdmin: adminId,
                    message: `{${error.key}}`,
                });
            }
            resolve();
        });
    }
}
