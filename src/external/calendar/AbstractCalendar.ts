import { ICalendarConnector, ICalendarEvent } from "../../gateways";
import { External } from "../External";
import { ILogger } from "../logging";

export abstract class AbstractCalendar<CalendarSetup> extends External implements ICalendarConnector {
    constructor(logger: ILogger, protected setupData: CalendarSetup) {
        super(logger);
    }
    abstract async getEvents(): Promise<ICalendarEvent[]>;
    abstract async getEventsBetween?(from: Date, to: Date): Promise<ICalendarEvent[]>;
}
