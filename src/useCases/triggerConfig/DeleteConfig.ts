import { Chats } from "../../entities";
import { IChatConfigSaver, ICommunication, ITimerStopper, MessageKey } from "../interfaces";
import { IUseCaseLogger } from "../logging";
import { UseCase } from "../UseCase";
import { convertChatToPersistence } from "../utils";

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
        private timerSettings: ITimerStopper,
        private persistence: IChatConfigSaver,
    ) {
        super(logger);
    }

    public execute({ chatId, userId, triggerId }: IDeleteConfigInput) {
        return new Promise<void>(resolve => {
            const chat = Chats.instance.getChat(chatId);
            chat.removeTimeFrame(triggerId, userId);
            this.timerSettings.stop(chatId, triggerId);
            this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
            this.communication.send(chatId, { key: MessageKey.DELETE_CONFIG, triggerId });
            resolve();
        });
    }
}
