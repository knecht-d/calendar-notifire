import { IRecurrenceRule, ITimeFrameSettings, ITimeFrameJSON } from "../../interfaces";
import { Chats } from "../../entities";
import { IUseCase } from "../UseCase";

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

export interface IChatPersistence {
    timeFrames: { [frameKey: string]: ITimeFrameJSON };
    administrators: string[];
}

export interface IUpdateCommunication {
    sendUpdateSuccess: (chatId: string, triggerId: string, message?: string) => void;
    sendUpdateError: (chatId: string, triggerId: string, message?: string) => void;
}

export interface IUpdateTimer {
    update: (chatId: string, triggerId: string, recurrence: IRecurrenceRule) => void;
}

export interface IUpdateChatPersistence {
    saveChatConfig: (chatId: string, chat: IChatPersistence) => void;
}

export class UpdateConfig implements IUseCase<IUpdateInput, void> {
    constructor(
        private updateCommunication: IUpdateCommunication,
        private timerSettings: IUpdateTimer,
        private persistence: IUpdateChatPersistence,
    ) {}

    public execute({ chatId, userId, triggerId, config }: IUpdateInput) {
        const chat = Chats.instance.getChat(chatId);
        chat.setTimeFrame(
            triggerId,
            { begin: config.frameStart, end: config.frameEnd, recurrence: config.recurrence },
            userId,
        );
        this.timerSettings.update(chatId, triggerId, config.recurrence);
        this.persistence.saveChatConfig(chatId, chat.toJSON());
        this.updateCommunication.sendUpdateSuccess(chatId, triggerId);
    }
}
