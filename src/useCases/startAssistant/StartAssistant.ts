import { IRecurrenceRule } from "../../interfaces";
import { Chats } from "../../entities";
import { UseCase } from "../UseCase";
import { IChatPersistence } from "../updateConfig";

export interface IStartAssistantTimer {
    set: (chatId: string, triggerId: string, recurrence: IRecurrenceRule) => void;
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
                chat.setTimeFrame(timeFameKey, timeFameData, chatData.administrators[0]);
                this.timerSettings.set(chatId, timeFameKey, timeFameData.recurrence);
            });
        });
    }
}
