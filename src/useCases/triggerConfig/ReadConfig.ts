import { Chats } from "../../entities";
import { ISerializedTimeFrame } from "../types";
import { UseCase } from "../UseCase";
import { convertRecurrence } from "../utils";

export interface IReadConfigInput {
    chatId: string;
}

export interface ITriggers {
    [key: string]: ISerializedTimeFrame;
}

export interface IReadConfigCommunication {
    sendReadConfig: (chatId: string, triggers: ITriggers) => void;
}

export abstract class ReadConfig extends UseCase<IReadConfigInput> {}
export class ReadConfigImpl extends ReadConfig {
    constructor(private communication: IReadConfigCommunication) {
        super();
    }

    public execute({ chatId }: IReadConfigInput) {
        const chat = Chats.instance.getChat(chatId);
        const chatConfig = chat.getConfig();
        const timeFrames = chatConfig.settings.reduce((frames, setting) => {
            frames[setting.key] = {
                begin: setting.frame.begin,
                end: setting.frame.end,
                recurrence: convertRecurrence(setting.recurrence),
            };
            return frames;
        }, {} as { [frameKey: string]: ISerializedTimeFrame });
        this.communication.sendReadConfig(chatId, timeFrames);
    }
}
