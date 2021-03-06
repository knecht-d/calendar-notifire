import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertChatToPersistence, toText } from "../utils";

export interface IInitInput {
    userId: string;
    chatId: string;
}

export abstract class InitializeChat extends UseCase<IInitInput> {}

export class InitializeChatImpl extends InitializeChat {
    constructor(logger: IUseCaseLogger, private communication: ICommunication, private persistence: IChatConfigSaver) {
        super(logger);
    }

    @logExecute()
    execute({ chatId, userId }: IInitInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.createChat(chatId, [userId]);
                this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
                this.communication.send(chatId, { key: MessageKey.INITIALIZE_CHAT });
            } catch (error) {
                this.logger.warn("InitializeChatImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.INITIALIZE_CHAT,
                    message: toText(error.key),
                });
            }
            resolve();
        });
    }
}
