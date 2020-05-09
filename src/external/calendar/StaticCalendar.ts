import { AbstractCalendar } from "./AbstractCalendar";
import { IEvent } from "../../useCases";

export class StaticCalendar extends AbstractCalendar<{ events: IEvent[] }> {
    getEventsBetween: undefined;

    private events: IEvent[];
    constructor(setupData: { events: IEvent[] }) {
        super(setupData);
        this.events = this.setupData.events;
    }
    getEvents(): IEvent[] {
        return this.events;
    }
}
