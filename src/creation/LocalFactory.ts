import { GenericFactory } from "./GenericFactory";
import { ConsoleChat, SimpleFileStorage, TestSetIntervalTimer } from "../external";
import { StaticCalendar } from "../external/calendar";
import { IEvent } from "../useCases";

export class LocalFactory extends GenericFactory<
    { events: IEvent[] },
    { file: string },
    { chatId: string; userId: string }
> {
    constructor() {
        super({
            calendar: StaticCalendar,
            chat: ConsoleChat,
            storage: SimpleFileStorage,
            timer: TestSetIntervalTimer,
        });
    }
}
