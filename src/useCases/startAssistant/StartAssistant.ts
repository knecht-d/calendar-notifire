import { Chats, TimeFrame } from "../../entities";
import { IChatConfigLoader, ITimerSetter } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";
import { createRecurrence } from "../utils";

export abstract class StartAssistant extends UseCase<void> {}
export class StartAssistantImpl extends StartAssistant {
    constructor(logger: IUseCaseLogger, private timerSettings: ITimerSetter, private configLoader: IChatConfigLoader) {
        super(logger);
    }

    @logExecute()
    execute() {
        return new Promise<void>(resolve => {
            try {
                const chatsData = this.configLoader.readAllChats();
                Object.entries(chatsData).forEach(([chatId, chatData]) => {
                    const chat = Chats.instance.createChat(chatId, chatData.administrators);
                    Object.entries(chatData.timeFrames).forEach(([timeFameKey, timeFameData]) => {
                        const timeFrame = new TimeFrame(timeFameData.begin, timeFameData.end);
                        const recurrence = createRecurrence(timeFameData.recurrence);
                        chat.setTimeFrame(
                            timeFameKey,
                            { frame: timeFrame, recurrence: recurrence },
                            chatData.administrators[0],
                        );
                        this.timerSettings.set(chatId, timeFameKey, timeFameData.recurrence);
                    });
                });
            } catch (error) {
                this.logger.error("StartAssistant", error);
            }
            resolve();
        });
    }
}
