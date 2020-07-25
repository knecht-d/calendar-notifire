import { Chats } from "../../entities";
import { ICommunication, ISerializedTrigger, ITriggerRead, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { convertRecurrence, toText } from "../utils";

export interface IReadConfigInput {
    chatId: string;
}

export abstract class ReadConfig extends UseCase<IReadConfigInput> {}
export class ReadConfigImpl extends ReadConfig {
    constructor(logger: IUseCaseLogger, private communication: ICommunication, private timerRead: ITriggerRead) {
        super(logger);
    }

    @logExecute()
    execute({ chatId }: IReadConfigInput) {
        return new Promise<void>(resolve => {
            try {
                const chat = Chats.instance.getChat(chatId);
                const chatConfig = chat.getConfig();
                const triggers = chatConfig.settings.reduce((triggers, setting) => {
                    const nextExecution = this.timerRead.getNext(chatId, setting.key);
                    triggers[setting.key] = {
                        frame: {
                            begin: setting.frame.begin,
                            end: setting.frame.end,
                        },
                        recurrence: convertRecurrence(setting.recurrence),
                        nextExecution: {
                            date: nextExecution,
                            from: chat.getTrigger(setting.key).frame.getStart(nextExecution),
                            to: chat.getTrigger(setting.key).frame.getEnd(nextExecution),
                        },
                    };
                    return triggers;
                }, {} as { [triggerKey: string]: ISerializedTrigger });
                this.communication.send(chatId, { key: MessageKey.READ_CONFIG, triggers: triggers });
            } catch (error) {
                this.logger.warn("ReadConfigImpl", error);
                this.communication.send(chatId, {
                    hasError: true,
                    key: MessageKey.READ_CONFIG,
                    triggers: {},
                    message: toText(error.key),
                });
            }
            resolve();
        });
    }
}
