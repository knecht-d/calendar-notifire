import { Chats } from "../../entities";
import { ICommunication, ISerializedTimeFrame, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertRecurrence } from "../utils";

export interface IReadConfigInput {
    chatId: string;
}

export abstract class ReadConfig extends UseCase<IReadConfigInput> {}
export class ReadConfigImpl extends ReadConfig {
    constructor(logger: IUseCaseLogger, private communication: ICommunication) {
        super(logger);
    }

    @logExecute()
    execute({ chatId }: IReadConfigInput) {
        return new Promise<void>(resolve => {
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
            this.communication.send(chatId, { key: MessageKey.READ_CONFIG, timeFrames });
            resolve();
        });
    }
}
