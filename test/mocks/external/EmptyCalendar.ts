import { AbstractCalendar } from "../../../src/external/calendar";

export class EmptyCalendar extends AbstractCalendar<{}> {
    getEventsBetween: undefined;
    constructor(setupData: {}) {
        super(setupData);
    }
    getEvents() {
        return [];
    }
}
