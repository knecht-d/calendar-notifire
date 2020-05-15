import { ICalendarEvent } from "../../gateways";
import { AbstractCalendar } from "./AbstractCalendar";

export class StaticCalendar extends AbstractCalendar<{ events: ICalendarEvent[] }> {
    getEventsBetween: undefined;

    private events: ICalendarEvent[];
    constructor(setupData: { events: ICalendarEvent[] }) {
        super(setupData);
        this.events = this.setupData.events;
    }
    getEvents(): ICalendarEvent[] {
        return this.events;
    }
}
