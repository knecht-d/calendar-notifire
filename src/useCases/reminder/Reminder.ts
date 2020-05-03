import { IUseCase } from "../UseCase";
import { Chats } from "../../entities";
import { UseCaseError, UseCaseErrorCode } from "../UseCaseError";

export interface IReminderIn {
    chatId: string;
    triggerId: string;
}

export interface IEvent {
    start: Date;
    end: Date;
    title: string;
    description?: string;
    location?: string;
}

export interface IEventProvider {
    getEventsBetween: (from: Date, to: Date) => IEvent[];
}

export interface IEventCommunication {
    sendEvents: (chatId: string, events: IEvent[]) => void;
}

export class Reminder implements IUseCase<IReminderIn, void> {
    constructor(private eventProvider: IEventProvider, private communication: IEventCommunication) {}
    execute({ chatId, triggerId }: IReminderIn) {
        const chat = Chats.instance.getChat(chatId);
        const timeFrame = chat.getTimeFrame(triggerId);
        if (!timeFrame) {
            throw new UseCaseError(UseCaseErrorCode.TRIGGER_NOT_DEFINED, { triggerId });
        }
        const currentTime = new Date();
        currentTime.setMilliseconds(0);
        currentTime.setSeconds(0);

        const from = timeFrame.getStart(currentTime);
        const to = timeFrame.getEnd(currentTime);
        const events = this.eventProvider.getEventsBetween(from, to);
        this.communication.sendEvents(chatId, events);
    }
}
