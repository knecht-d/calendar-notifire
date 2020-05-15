import { Chats, TimeFrame } from "../../entities";
import { IChatPersistence, IPersistedRecurrenceRule } from "../types";
import { UseCase } from "../UseCase";
import { createRecurrence } from "../utils";

export interface IStartAssistantTimer {
    set: (chatId: string, triggerId: string, recurrence: IPersistedRecurrenceRule) => void;
}

export interface IStartAssistantPersistence {
    readAllChats: () => { [chatId: string]: IChatPersistence };
}

export abstract class StartAssistant extends UseCase<void> {}
export class StartAssistantImpl extends StartAssistant {
    constructor(private timerSettings: IStartAssistantTimer, private persistence: IStartAssistantPersistence) {
        super();
    }

    public execute() {
        const chatsData = this.persistence.readAllChats();
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
    }
}
