import IcalExpander from "ical-expander";
import { ICalendarEvent } from "../../gateways";
import { get } from "../http";
import { ILogger } from "../logging";
import { AbstractCalendar } from "./AbstractCalendar";

export class WebCalendar extends AbstractCalendar<{ url: string }> {
    private url: string;
    constructor(logger: ILogger, setupData: { url: string }) {
        super(logger, setupData);
        this.url = setupData.url;
    }
    async getEvents(): Promise<ICalendarEvent[]> {
        const ics = await get<string>(this.url);
        const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
        const events = icalExpander.all();
        const mappedEvents: ICalendarEvent[] = events.events.map(e => ({
            start: e.startDate.toJSDate(),
            end: e.endDate.toJSDate(),
            title: e.summary,
            description: e.description,
            location: e.location,
        }));
        const mappedOccurrences: ICalendarEvent[] = events.occurrences.map(e => ({
            start: e.startDate.toJSDate(),
            end: e.endDate.toJSDate(),
            title: e.item.summary,
            description: e.item.description,
            location: e.item.location,
        }));
        const allEvents: ICalendarEvent[] = ([] as ICalendarEvent[])
            .concat(mappedEvents, mappedOccurrences)
            .sort((a, b) => a.start.getTime() - b.start.getTime());
        return allEvents;
    }
    async getEventsBetween(from: Date, to: Date): Promise<ICalendarEvent[]> {
        const ics = await get<string>(this.url);
        const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
        const events = icalExpander.between(from, to);
        const mappedEvents: ICalendarEvent[] = events.events.map(e => ({
            start: e.startDate.toJSDate(),
            end: e.endDate.toJSDate(),
            title: e.summary,
            description: e.description,
            location: e.location,
        }));
        const mappedOccurrences: ICalendarEvent[] = events.occurrences.map(e => ({
            start: e.startDate.toJSDate(),
            end: e.endDate.toJSDate(),
            title: e.item.summary,
            description: e.item.description,
            location: e.item.location,
        }));
        const allEvents: ICalendarEvent[] = ([] as ICalendarEvent[])
            .concat(mappedEvents, mappedOccurrences)
            .sort((a, b) => a.start.getTime() - b.start.getTime());
        return allEvents;
    }
}
