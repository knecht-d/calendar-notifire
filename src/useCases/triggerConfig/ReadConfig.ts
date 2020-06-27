import { Chats } from "../../entities";
import { ICommunication, ISerializedTimeFrame, ITimerRead, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertRecurrence } from "../utils";

export interface IReadConfigInput {
    chatId: string;
}

export abstract class ReadConfig extends UseCase<IReadConfigInput> {}
export class ReadConfigImpl extends ReadConfig {
    constructor(logger: IUseCaseLogger, private communication: ICommunication, private timerRead: ITimerRead) {
        super(logger);
    }

    @logExecute()
    execute({ chatId }: IReadConfigInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.getChat(chatId);
                const chatConfig = chat.getConfig();
                const timeFrames = chatConfig.settings.reduce((frames, setting) => {
                    const nextExecution = this.timerRead.getNext(chatId, setting.key);
                    frames[setting.key] = {
                        begin: setting.frame.begin,
                        end: setting.frame.end,
                        recurrence: convertRecurrence(setting.recurrence),
                        next: nextExecution,
                        nextEventsFrom: chat.getTimeFrame(setting.key).frame.getStart(nextExecution),
                        nextEventsTo: chat.getTimeFrame(setting.key).frame.getEnd(nextExecution),
                    };
                    return frames;
                }, {} as { [frameKey: string]: ISerializedTimeFrame });
                this.communication.send(chatId, { key: MessageKey.READ_CONFIG, triggers: timeFrames });
            } catch (error) {
                this.logger.warn("DeleteConfigImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.READ_CONFIG,
                    triggers: {},
                    message: `{${error.key}}`,
                });
            }
            resolve();
        });
    }
}
