import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, ITriggerStopper, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertChatToPersistence, toText } from "../utils";

export interface IDeleteConfigInput {
    userId: string;
    chatId: string;
    triggerId: string;
}

export abstract class DeleteConfig extends UseCase<IDeleteConfigInput> {}
export class DeleteConfigImpl extends DeleteConfig {
    constructor(
        logger: IUseCaseLogger,
        private communication: ICommunication,
        private timerSettings: ITriggerStopper,
        private persistence: IChatConfigSaver,
    ) {
        super(logger);
    }

    @logExecute()
    execute({ chatId, userId, triggerId }: IDeleteConfigInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.getChat(chatId);
                chat.removeTrigger(triggerId, userId);
                this.timerSettings.stop(chatId, triggerId);
                this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
                this.communication.send(chatId, { key: MessageKey.DELETE_CONFIG, triggerId });
            } catch (error) {
                this.logger.warn("DeleteConfigImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.DELETE_CONFIG,
                    triggerId,
                    message: toText(error.key),
                });
            }
            resolve();
        });
    }
}
