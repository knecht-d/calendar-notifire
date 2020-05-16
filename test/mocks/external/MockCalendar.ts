import { AbstractCalendar } from "../../../src/external/calendar";
import { ICalendarEvent } from "../../../src/gateways";

export interface IMockCalendarSetupData {
    events: ICalendarEvent[];
}
export class MockCalendar extends AbstractCalendar<IMockCalendarSetupData> {
    getEventsBetween: undefined;
    public events: ICalendarEvent[];
    constructor(setupData: IMockCalendarSetupData) {
        super(setupData);
        this.events = setupData.events;
    }
    getEvents() {
        return this.events;
    }
}
