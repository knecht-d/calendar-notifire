import { IRecurrenceRule, ITimeFrameSettings } from "../../interfaces";
import { Chats } from "../../entities";
import { UseCase } from "../UseCase";

export interface IUpdateInput {
    userId: string;
    chatId: string;
    triggerId: string;
    config: {
        recurrence: IRecurrenceRule;
        frameStart: ITimeFrameSettings;
        frameEnd: ITimeFrameSettings;
    };
}

export interface IUpdateCommunication {
    sendUpdateSuccess: (chatId: string, triggerId: string, message?: string) => void;
    sendUpdateError: (message?: string) => void;
}

export interface IUpdateTimer {
    update: (
        chatId: string,
        triggerId: string,
        config: {
            recurrence: IRecurrenceRule;
            frameStart: ITimeFrameSettings;
            frameEnd: ITimeFrameSettings;
        },
    ) => void;
}

export interface IUpdateChatPersistence {
    saveUpdatedConfig: (chatConfig: object) => void;
}

export class UpdateConfig implements UseCase<IUpdateInput, void> {
    constructor(
        private updateCommunication: IUpdateCommunication,
        private timerSettings: IUpdateTimer,
        private persistance: IUpdateChatPersistence,
    ) {}

    public execute({ chatId, triggerId, config }: IUpdateInput) {
        const chat = Chats.instance.getChat(chatId);
        chat.addTimeFrame(triggerId, { begin: config.frameStart, end: config.frameEnd, recurrence: config.recurrence });
        this.timerSettings.update(chatId, triggerId, config);
        this.persistance.saveUpdatedConfig(Chats.instance.toJSON());
        this.updateCommunication.sendUpdateSuccess(chatId, triggerId);
    }
}
