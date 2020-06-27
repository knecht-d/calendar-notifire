import MockDate from "mockdate";
import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { MessageKey, ReadConfig, ReadConfigImpl } from "../../../../src/useCases";
import { MockChatEntity, MockChats, MockCommunicationPresenter, MockTriggerGateway } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks/Entities").MockChats;
    return {
        Chats: MockChats,
    };
});
jest.mock("../../../../src/useCases/utils", () => ({
    convertRecurrence: jest.fn().mockImplementation(x => x),
}));
describe("ReadConfig", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockTriggerGateway: MockTriggerGateway;
    let mockLogger: MockLogger;
    let useCase: ReadConfig;
    beforeAll(() => {
        MockDate.set(new Date(2020, 4, 10, 0, 12, 13, 14));
        jest.clearAllMocks();
        mockLogger = new MockLogger();
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockTriggerGateway = new MockTriggerGateway(mockLogger);
        useCase = new ReadConfigImpl(mockLogger, mockCommunication, mockTriggerGateway);
    });
    describe("execute", () => {
        it("pass the config", async () => {
            const settings = [
                {
                    key: "frame1",
                    frame: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                    },
                    recurrence: { mock: "recurrence" },
                },
                {
                    key: "frame2",
                    frame: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                    },
                    recurrence: { mock: "recurrence" },
                },
            ];
            MockChatEntity.getConfig.mockReturnValue({
                settings,
                administrators: ["admin1", "admin2"],
            });
            MockChatEntity.getTimeFrame.mockReturnValue({
                frame: {
                    getStart: jest.fn().mockImplementation((current: Date) => {
                        const newDate = new Date(current);
                        newDate.setDate(newDate.getDate() + 1);
                        return newDate;
                    }),
                    getEnd: jest.fn().mockImplementation((current: Date) => {
                        const newDate = new Date(current);
                        newDate.setDate(newDate.getDate() + 2);
                        return newDate;
                    }),
                },
            });
            await useCase.execute({ chatId: "chat" });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.READ_CONFIG,
                triggers: {
                    frame1: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                        recurrence: { mock: "recurrence" },
                        next: new Date(2020, 4, 10, 0, 12, 13, 14),
                        nextEventsFrom: new Date(2020, 4, 11, 0, 12, 13, 14),
                        nextEventsTo: new Date(2020, 4, 12, 0, 12, 13, 14),
                    },
                    frame2: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                        recurrence: { mock: "recurrence" },
                        next: new Date(2020, 4, 10, 0, 12, 13, 14),
                        nextEventsFrom: new Date(2020, 4, 11, 0, 12, 13, 14),
                        nextEventsTo: new Date(2020, 4, 12, 0, 12, 13, 14),
                    },
                },
            });
        });
        it("should send an error if chat was not initialized", async () => {
            MockChats.instance.getChat.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.CHAT_NOT_EXISTING);
            });
            await useCase.execute({ chatId: "chat" });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                hasError: true,
                key: MessageKey.READ_CONFIG,
                triggers: {},
                message: `{${EntityErrorCode.CHAT_NOT_EXISTING}}`,
            });
        });
    });
});
