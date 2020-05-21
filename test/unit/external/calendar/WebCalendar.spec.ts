import { readFile } from "fs";
import { normalize } from "path";
import { get, WebCalendar } from "../../../../src/external";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/external/http", () => ({
    get: jest.fn(
        () =>
            new Promise(res => {
                readFile(normalize(`${__dirname}/TestCalendar.ics`), { encoding: "utf-8" }, (err, data) => {
                    res(data);
                });
            }),
    ),
}));
describe("WebCalendar", () => {
    const mockLogger = new MockLogger();
    const allEvents = [
        {
            start: new Date("2020-05-14T10:00:00.000Z"),
            end: new Date("2020-05-14T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-05-17T10:00:00.000Z"),
            end: new Date("2020-05-17T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-05-20T10:00:00.000Z"),
            end: new Date("2020-05-20T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-05-21T13:00:00.000Z"),
            end: new Date("2020-05-21T14:00:00.000Z"),
            location: "Nowhere",
            description: "First one-time event",
            title: "Test1",
        },
        {
            start: new Date("2020-05-22T15:00:00.000Z"),
            end: new Date("2020-05-22T18:00:00.000Z"),
            location: "Anywhere",
            description: "Second one-time event",
            title: "Test2",
        },
        {
            start: new Date("2020-05-23T10:00:00.000Z"),
            end: new Date("2020-05-23T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-05-26T10:00:00.000Z"),
            end: new Date("2020-05-26T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-05-29T10:00:00.000Z"),
            end: new Date("2020-05-29T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-06-01T10:00:00.000Z"),
            end: new Date("2020-06-01T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-06-04T10:00:00.000Z"),
            end: new Date("2020-06-04T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-06-07T10:00:00.000Z"),
            end: new Date("2020-06-07T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
        {
            start: new Date("2020-06-10T10:00:00.000Z"),
            end: new Date("2020-06-10T11:00:00.000Z"),
            location: "Somewhere",
            description: "Multiple Events",
            title: "Multiple",
        },
    ];
    beforeEach(() => {
        (get as jest.Mock).mockClear();
    });
    describe("getEventsBetween", () => {
        it("should return a subset of the events", async () => {
            const calendar = new WebCalendar(mockLogger, { url: "example.com/calendar.ics" });
            const events = await calendar.getEventsBetween(
                new Date("2020-05-22T15:00:00.000Z"),
                new Date("2020-06-07T10:30:00.000Z"),
            );
            expect(events).toEqual(allEvents.slice(4, 11));
            expect(get).toHaveBeenCalledTimes(1);
            expect(get).toHaveBeenLastCalledWith("example.com/calendar.ics");
        });
    });
    describe("getEvents", () => {
        it("should return the events passed into the constructor", async () => {
            const calendar = new WebCalendar(mockLogger, { url: "example.com/calendar.ics" });
            const events = await calendar.getEvents();
            expect(events).toEqual(allEvents);
            expect(get).toHaveBeenCalledTimes(1);
            expect(get).toHaveBeenLastCalledWith("example.com/calendar.ics");
        });
    });
});
