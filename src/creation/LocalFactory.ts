import { ConsoleChat, SetIntervalTimer, SimpleFileStorage, StaticCalendar } from "../external";
import { IEvent } from "../useCases";
import { GenericFactory } from "./GenericFactory";

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
            timer: SetIntervalTimer,
        });
    }
}
