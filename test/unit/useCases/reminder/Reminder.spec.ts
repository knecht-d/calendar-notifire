import MockDate from "mockdate";
import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { MessageKey, Reminder, ReminderImpl } from "../../../../src/useCases";
import { MockCalendarGateway, MockChatEntity, MockCommunicationPresenter, MockTimeFrame } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("Reminder", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockCalendar: MockCalendarGateway;
    let mockLogger: MockLogger;
    let useCase: Reminder;
    beforeAll(() => {
        MockDate.set(new Date(2020, 4, 10, 0, 12, 13, 14));
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockCalendar = new MockCalendarGateway(mockLogger);
        mockLogger = new MockLogger();
        useCase = new ReminderImpl(mockLogger, mockCalendar, mockCommunication);
    });
    beforeEach(() => {
        mockCalendar.getEventsBetween.mockClear();
        mockCommunication.send.mockClear();
    });
    afterAll(() => {
        jest.clearAllMocks();
    });
    describe("execute", () => {
        it("should return the Events in the given timeframe", async () => {
            const dateStart = new Date(2020, 4, 10, 0, 32);
            const dateEnd = new Date(2020, 4, 10, 0, 42);
            MockTimeFrame.getStart.mockReturnValueOnce(dateStart);
            MockTimeFrame.getEnd.mockReturnValueOnce(dateEnd);
            mockCalendar.getEventsBetween.mockReturnValue([{ mocked: "Event" }]);

            await useCase.execute({ chatId: "chat", triggerId: "trigger" });

            expect(MockTimeFrame.getStart).toHaveBeenCalledWith(new Date(2020, 4, 10, 0, 12, 0, 0));
            expect(MockTimeFrame.getEnd).toHaveBeenCalledWith(new Date(2020, 4, 10, 0, 12, 0, 0));
            expect(mockCalendar.getEventsBetween).toHaveBeenCalledWith(dateStart, dateEnd);
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.EVENTS,
                events: [{ mocked: "Event" }],
            });
        });
        it("should log an error if trigger was not defined", async () => {
            MockChatEntity.getTimeFrame.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.TRIGGER_NOT_DEFINED);
            });
            await useCase.execute({ chatId: "chat", triggerId: "trigger" });
            expect(MockChatEntity.addAdmin).not.toHaveBeenCalled();
            expect(mockCalendar.getEventsBetween).not.toHaveBeenCalled();
            expect(mockCommunication.send).not.toHaveBeenCalled();
            expect(mockLogger.error).toHaveBeenCalledWith(
                "ReminderImpl",
                new EntityError(EntityErrorCode.TRIGGER_NOT_DEFINED),
            );
        });
    });
});
