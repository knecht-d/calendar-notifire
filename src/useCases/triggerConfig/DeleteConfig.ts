import { Chats } from "../../entities";
import { IChatConfigSaver, ITimerStopper } from "../interfaces";
import { UseCase } from "../UseCase";
import { convertChatToPersistence } from "../utils";

export interface IDeleteConfigInput {
    userId: string;
    chatId: string;
    triggerId: string;
}

export interface IDeleteConfigCommunication {
    sendDeleteConfigSuccess: (chatId: string, triggerId: string, message?: string) => void;
    sendDeleteConfigError: (chatId: string, triggerId: string, message?: string) => void;
}

export abstract class DeleteConfig extends UseCase<IDeleteConfigInput> {}
export class DeleteConfigImpl extends DeleteConfig {
    constructor(
        private communication: IDeleteConfigCommunication,
        private timerSettings: ITimerStopper,
        private persistence: IChatConfigSaver,
    ) {
        super();
    }

    public execute({ chatId, userId, triggerId }: IDeleteConfigInput) {
        const chat = Chats.instance.getChat(chatId);
        chat.removeTimeFrame(triggerId, userId);
        this.timerSettings.stop(chatId, triggerId);
        this.persistence.saveChatConfig(chatId, convertChatToPersistence(chat));
        this.communication.sendDeleteConfigSuccess(chatId, triggerId);
    }
}
