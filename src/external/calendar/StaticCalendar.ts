import { ICalendarEvent } from "../../gateways";
import { ILogger } from "../logging";
import { AbstractCalendar } from "./AbstractCalendar";

export class StaticCalendar extends AbstractCalendar<{ events: ICalendarEvent[] }> {
    getEventsBetween: undefined;

    private events: ICalendarEvent[];
    constructor(logger: ILogger, setupData: { events: ICalendarEvent[] }) {
        super(logger, setupData);
        this.events = this.setupData.events;
    }
    getEvents(): Promise<ICalendarEvent[]> {
        return Promise.resolve(this.events);
    }
}
