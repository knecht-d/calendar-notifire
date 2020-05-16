import { GenericFactory } from "../../src/creation";
import { IMockCalendarSetupData, MockCalendar, MockChat, MockStorage, MockTimer } from "./external";

export class MockFactory extends GenericFactory<IMockCalendarSetupData, {}, {}> {
    constructor() {
        super({
            calendar: MockCalendar,
            chat: MockChat,
            storage: MockStorage,
            timer: MockTimer,
        });
    }
}
