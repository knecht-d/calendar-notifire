import { ICalendarConnector, ICalendarEvent } from "../../gateways";

export abstract class AbstractCalendar<CalendarSetup> implements ICalendarConnector {
    constructor(protected setupData: CalendarSetup) {}
    abstract getEvents(): ICalendarEvent[];
    abstract getEventsBetween?(from: Date, to: Date): ICalendarEvent[];
}
