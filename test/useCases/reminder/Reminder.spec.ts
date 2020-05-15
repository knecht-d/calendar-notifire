import MockDate from "mockdate";
import { MessageKey, Reminder, ReminderImpl } from "../../../src/useCases";
import { MockCalendarGateway, MockChatEntity, MockCommunicationPresenter, MockTimeFrame } from "../../mocks";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("Reminder", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockCalendar: MockCalendarGateway;
    let useCase: Reminder;
    beforeAll(() => {
        MockDate.set(new Date(2020, 4, 10, 0, 12, 13, 14));
        mockCommunication = new MockCommunicationPresenter();
        mockCalendar = new MockCalendarGateway();
        useCase = new ReminderImpl(mockCalendar, mockCommunication);
    });
    beforeEach(() => {
        mockCalendar.getEventsBetween.mockClear();
        mockCommunication.send.mockClear();
    });
    afterAll(() => {
        MockDate.reset();
    });
    describe("execute", () => {
        it("should return the Events in the given timeframe", () => {
            const dateStart = new Date(2020, 4, 10, 0, 32);
            const dateEnd = new Date(2020, 4, 10, 0, 42);
            MockTimeFrame.getStart.mockReturnValueOnce(dateStart);
            MockTimeFrame.getEnd.mockReturnValueOnce(dateEnd);
            mockCalendar.getEventsBetween.mockReturnValue([{ mocked: "Event" }]);

            useCase.execute({ chatId: "chat", triggerId: "trigger" });

            expect(MockTimeFrame.getStart).toHaveBeenCalledWith(new Date(2020, 4, 10, 0, 12, 0, 0));
            expect(MockTimeFrame.getEnd).toHaveBeenCalledWith(new Date(2020, 4, 10, 0, 12, 0, 0));
            expect(mockCalendar.getEventsBetween).toHaveBeenCalledWith(dateStart, dateEnd);
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.EVENTS,
                events: [{ mocked: "Event" }],
            });
        });
        it("should throw if the timeframe does not exist", () => {
            MockChatEntity.getTimeFrame.mockReturnValue(undefined);

            expect(() => {
                useCase.execute({ chatId: "chat", triggerId: "trigger" });
            }).toThrow('TRIGGER_NOT_DEFINED: {"triggerId":"trigger"}');

            expect(mockCalendar.getEventsBetween).not.toHaveBeenCalled();
            expect(mockCommunication.send).not.toHaveBeenCalled();
        });
    });
});
