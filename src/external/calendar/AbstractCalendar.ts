import { ICalendarConnector } from "../../gateways";
import { IEvent } from "../../useCases";

export abstract class AbstractCalendar<CalendarSetup> implements ICalendarConnector {
    constructor(protected setupData: CalendarSetup) {}
    abstract getEvents(): IEvent[];
    abstract getEventsBetween?(from: Date, to: Date): IEvent[];
}
