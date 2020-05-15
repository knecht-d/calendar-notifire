import { IEventProvider, IEvent } from "../../useCases";
import { GateWay } from "../GateWay";

export interface ICalendarConnector {
    getEvents: () => ICalendarEvent[];
    getEventsBetween?: (from: Date, to: Date) => ICalendarEvent[];
}

export type ICalendarEvent = IEvent;

interface ICalendarGatewayDependencies {
    calendarConnector: ICalendarConnector;
}

export class CalendarGateway extends GateWay<ICalendarGatewayDependencies> implements IEventProvider {
    getEventsBetween(from: Date, to: Date): IEvent[] {
        this.checkInitialized();
        let events: ICalendarEvent[] = [];
        if (this.dependencies!.calendarConnector.getEventsBetween) {
            events = this.dependencies!.calendarConnector.getEventsBetween(from, to);
        } else {
            events = this.dependencies!.calendarConnector.getEvents();
            events = events.filter(event => event.start >= from && event.start <= to);
        }
        events = events.sort((a, b) => a.start.getTime() - b.start.getTime());
        return events;
    }
}
