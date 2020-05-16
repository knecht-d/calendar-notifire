import { ICalendarConnector, ICalendarEvent } from "../../gateways";

export abstract class AbstractCalendar<CalendarSetup> implements ICalendarConnector {
    constructor(protected setupData: CalendarSetup) {}
    abstract async getEvents(): Promise<ICalendarEvent[]>;
    abstract async getEventsBetween?(from: Date, to: Date): Promise<ICalendarEvent[]>;
}
