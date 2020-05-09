import { GenericFactory } from "../../src/creation";
import { EmptyCalendar, MockChat, MockStorage, MockTimer } from "./external";

export class MockFactory extends GenericFactory<{}, {}, {}> {
    constructor() {
        super({
            calendar: EmptyCalendar,
            chat: MockChat,
            storage: MockStorage,
            timer: MockTimer,
        });
    }
}
