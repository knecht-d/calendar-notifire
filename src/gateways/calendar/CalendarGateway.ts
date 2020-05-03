import { IEventProvider, IEvent } from "../../useCases";

export interface ICalendarConnector {
    getEvents: () => IEvent[];
    getEventsBetween?: (from: Date, to: Date) => IEvent[];
}

export class CalendarGateway implements IEventProvider {
    constructor(private calendarConnector: ICalendarConnector) {}
    getEventsBetween(from: Date, to: Date): IEvent[] {
        let events: IEvent[] = [];
        if (this.calendarConnector.getEventsBetween) {
            events = this.calendarConnector.getEventsBetween(from, to);
        } else {
            events = this.calendarConnector.getEvents();
            events = events.filter(event => event.start >= from && event.start <= to);
        }
        events = events.sort((a, b) => a.start.getTime() - b.start.getTime());
        return events;
    }
}
