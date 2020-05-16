import { CalendarGateway } from "../../../../src/gateways";

describe("CalendarGateway", () => {
    const mockEvents = [
        {
            start: new Date(2020, 4, 2, 18, 0),
            end: new Date(2020, 4, 2, 19, 0),
            title: "Event2",
        },
        {
            start: new Date(2020, 4, 1, 16, 0),
            end: new Date(2020, 4, 1, 18, 0),
            title: "Event1",
        },
        {
            start: new Date(2020, 4, 5, 17, 0),
            end: new Date(2020, 4, 5, 20, 30),
            title: "Event3",
        },
        {
            start: new Date(2020, 4, 10, 18, 0),
            end: new Date(2020, 4, 10, 19, 45),
            title: "Event4",
        },
    ];
    const mockSimpleCalendarConnector = {
        getEvents: jest.fn(() => Promise.resolve(mockEvents)),
    };
    const mockExtendedCalendarConnector = {
        getEvents: jest.fn(() => Promise.resolve([])),
        getEventsBetween: jest.fn(() => Promise.resolve([])),
    };
    beforeEach(() => {
        mockSimpleCalendarConnector.getEvents.mockClear();
        mockExtendedCalendarConnector.getEvents.mockClear();
        mockExtendedCalendarConnector.getEventsBetween.mockClear();
    });
    describe("getEventsBetween", () => {
        it("should call getEventsBetween if it is implemented", async () => {
            const gateway = new CalendarGateway();
            gateway.init({ calendarConnector: mockExtendedCalendarConnector });
            const from = new Date(2020, 4, 2, 0, 0);
            const to = new Date(2020, 4, 7, 0, 0);
            await gateway.getEventsBetween(from, to);
            expect(mockExtendedCalendarConnector.getEventsBetween).toHaveBeenCalledWith(from, to);
            expect(mockExtendedCalendarConnector.getEvents).not.toHaveBeenCalled();
        });
        it("should call getEvent if getEventsBetween is not implemented", async () => {
            const gateway = new CalendarGateway();
            gateway.init({ calendarConnector: mockSimpleCalendarConnector });
            const from = new Date(2020, 4, 2, 0, 0);
            const to = new Date(2020, 4, 7, 0, 0);
            await gateway.getEventsBetween(from, to);
            expect(mockSimpleCalendarConnector.getEvents).toHaveBeenCalledWith();
        });
        it("should filter events if getEvents is used", async () => {
            const gateway = new CalendarGateway();
            gateway.init({ calendarConnector: mockSimpleCalendarConnector });
            const from = new Date(2020, 4, 2, 0, 0);
            const to = new Date(2020, 4, 7, 0, 0);
            const events = await gateway.getEventsBetween(from, to);
            expect(events).toEqual([mockEvents[0], mockEvents[2]]);
        });
        it("should sort the events ascending by the start date", async () => {
            const gateway = new CalendarGateway();
            gateway.init({ calendarConnector: mockSimpleCalendarConnector });
            const from = new Date(2020, 4, 1, 0, 0);
            const to = new Date(2020, 4, 11, 0, 0);
            const events = await gateway.getEventsBetween(from, to);
            expect(events).toEqual([mockEvents[1], mockEvents[0], mockEvents[2], mockEvents[3]]);
        });
        it("should filter the events based on the start date", async () => {
            const events = [
                {
                    start: new Date(2020, 4, 1, 12, 0),
                    end: new Date(2020, 4, 2, 12, 0),
                    title: "Event1",
                },
                {
                    start: new Date(2020, 4, 2, 12, 0),
                    end: new Date(2020, 4, 3, 12, 0),
                    title: "Event2",
                },
                {
                    start: new Date(2020, 4, 3, 12, 0),
                    end: new Date(2020, 4, 4, 12, 0),
                    title: "Event3",
                },
            ];
            const mockConnector = {
                getEvents: jest.fn(() => Promise.resolve(events)),
            };
            const gateway = new CalendarGateway();
            gateway.init({ calendarConnector: mockConnector });
            const from = new Date(2020, 4, 2, 0, 0);
            const to = new Date(2020, 4, 4, 0, 0);
            const filteredEvents = await gateway.getEventsBetween(from, to);
            expect(filteredEvents).toEqual([events[1], events[2]]);
        });
        it("should filter the events preciely to the minute", async () => {
            const newEvent = (hour: number, minute: number) => ({
                start: new Date(2020, 4, 1, hour, minute),
                end: new Date(2020, 4, 1, hour, minute),
                title: `Event ${hour}:${minute}`,
            });
            const events: Array<{ start: Date; end: Date; title: string }> = [];
            for (let h = 0; h < 3; h++) {
                for (let m = 0; m < 60; m++) {
                    events.push(newEvent(h, m));
                }
            }
            const mockConnector = {
                getEvents: jest.fn(() => Promise.resolve(events)),
            };
            const gateway = new CalendarGateway();
            gateway.init({ calendarConnector: mockConnector });
            const from = new Date(2020, 4, 1, 1, 13);
            const to = new Date(2020, 4, 1, 2, 42);
            const filteredEvents = await gateway.getEventsBetween(from, to);
            expect(filteredEvents).toHaveLength(90);
            expect(filteredEvents[0].title).toEqual("Event 1:13");
            expect(filteredEvents[89].title).toEqual("Event 2:42");
        });
    });
});
