import { Chats } from "../../entities";
import { UseCase } from "../UseCase";
import { ITimeFrameJSON } from "../../interfaces";

export interface IReadConfigInput {
    chatId: string;
}

export interface ITriggers {
    [key: string]: ITimeFrameJSON;
}

export interface IReadConfigCommunication {
    sendReadConfig: (chatId: string, triggers: ITriggers) => void;
}

export abstract class ReadConfig extends UseCase<IReadConfigInput> {}
export class ReadConfigImpl extends ReadConfig {
    constructor(private updateCommunication: IReadConfigCommunication) {
        super();
    }

    public execute({ chatId }: IReadConfigInput) {
        const chat = Chats.instance.getChat(chatId);
        const chatData = chat.toJSON();
        this.updateCommunication.sendReadConfig(chatId, chatData.timeFrames);
    }
}
