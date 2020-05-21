import { ILogger } from "../../../src/external";
import { AbstractCalendar } from "../../../src/external/calendar";

export class EmptyCalendar extends AbstractCalendar<{}> {
    getEventsBetween: undefined;
    constructor(logger: ILogger, setupData: {}) {
        super(logger, setupData);
    }
    getEvents() {
        return Promise.resolve([]);
    }
}
