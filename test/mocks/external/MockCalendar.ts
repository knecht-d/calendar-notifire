import { ILogger } from "../../../src/external";
import { AbstractCalendar } from "../../../src/external/calendar";
import { ICalendarEvent } from "../../../src/gateways";

export interface IMockCalendarSetupData {
    events: ICalendarEvent[];
}
export class MockCalendar extends AbstractCalendar<IMockCalendarSetupData> {
    getEventsBetween: undefined;
    public events: ICalendarEvent[];
    constructor(logger: ILogger, setupData: IMockCalendarSetupData) {
        super(logger, setupData);
        this.events = setupData.events;
    }
    getEvents() {
        return Promise.resolve(this.events);
    }
}
