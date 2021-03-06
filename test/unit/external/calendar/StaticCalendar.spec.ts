import { StaticCalendar } from "../../../../src/external";
import { MockLogger } from "../../../mocks/external/MockLogger";

describe("StaticCalendar", () => {
    describe("getEventsBetween", () => {
        it("should be undefined", () => {
            const mockLogger = new MockLogger();
            const calendar = new StaticCalendar(mockLogger, { events: [] });
            expect(calendar.getEventsBetween).toBeUndefined();
        });
    });
    describe("getEvents", () => {
        it("should return the events passed into the constructor", async () => {
            const staticEvents = [
                {
                    title: "Event1",
                    start: new Date(2020, 4, 16, 12, 30, 0, 0),
                    end: new Date(2020, 4, 16, 13, 30, 0, 0),
                },
                {
                    title: "Event2",
                    start: new Date(2020, 4, 16, 13, 30, 0, 0),
                    end: new Date(2020, 4, 16, 14, 30, 0, 0),
                },
                {
                    title: "Event3",
                    start: new Date(2020, 4, 16, 14, 30, 0, 0),
                    end: new Date(2020, 4, 16, 15, 30, 0, 0),
                },
            ];
            const mockLogger = new MockLogger();
            const calendar = new StaticCalendar(mockLogger, { events: staticEvents });
            await expect(calendar.getEvents()).resolves.toEqual(staticEvents);
        });
    });
});
