import { IEvent, IEventProvider } from "../../useCases";
import { GateWay } from "../GateWay";
import { logCall, logTime } from "../logging";

export interface ICalendarConnector {
    getEvents: () => Promise<ICalendarEvent[]>;
    getEventsBetween?: (from: Date, to: Date) => Promise<ICalendarEvent[]>;
}

export interface ICalendarEvent {
    start: Date;
    end: Date;
    title: string;
    description?: string;
    location?: string;
}

interface ICalendarGatewayDependencies {
    calendarConnector: ICalendarConnector;
}

export class CalendarGateway extends GateWay<ICalendarGatewayDependencies> implements IEventProvider {
    @logCall()
    @logTime({ async: true })
    async getEventsBetween(from: Date, to: Date): Promise<IEvent[]> {
        this.checkInitialized();
        let eventsFromSource: ICalendarEvent[] = [];
        if (this.dependencies!.calendarConnector.getEventsBetween) {
            this.logger.debug("CalendarGateway", "using getEventsBetween of connector");
            eventsFromSource = await this.dependencies!.calendarConnector.getEventsBetween(from, to);
        } else {
            this.logger.debug("CalendarGateway", "using getEvents of connector");
            eventsFromSource = await this.dependencies!.calendarConnector.getEvents();
            eventsFromSource = eventsFromSource.filter(event => event.start >= from && event.start <= to);
        }
        const events: IEvent[] = eventsFromSource
            .sort((a, b) => a.start.getTime() - b.start.getTime())
            .map(event => ({
                start: event.start,
                end: event.end,
                title: event.title,
                description: event.description,
                location: event.location,
            }));
        return events;
    }
}
