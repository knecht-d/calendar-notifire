import { Chats } from "../../entities";
import { ICommunication, IEvent, MessageKey } from "../interfaces";
import { IUseCaseLogger, logExecute } from "../logging";
import { UseCase } from "../UseCase";

export interface IReminderIn {
    chatId: string;
    triggerId: string;
}

export interface IEventProvider {
    getEventsBetween: (from: Date, to: Date) => Promise<IEvent[]>;
}

export abstract class Reminder extends UseCase<IReminderIn> {}
export class ReminderImpl extends Reminder {
    constructor(logger: IUseCaseLogger, private eventProvider: IEventProvider, private communication: ICommunication) {
        super(logger);
    }

    @logExecute()
    async execute({ chatId, triggerId }: IReminderIn) {
        try {
            const chat = Chats.instance.getChat(chatId);
            const timeFrame = chat.getTimeFrame(triggerId).frame;
            const currentTime = new Date();
            currentTime.setMilliseconds(0);
            currentTime.setSeconds(0);

            const from = timeFrame.getStart(currentTime);
            const to = timeFrame.getEnd(currentTime);
            const events = await this.eventProvider.getEventsBetween(from, to);
            this.communication.send(chatId, { key: MessageKey.EVENTS, events });
        } catch (error) {
            this.logger.error("ReminderImpl", error);
        }
    }
}
