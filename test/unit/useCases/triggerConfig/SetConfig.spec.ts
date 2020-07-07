import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { MessageKey, SetConfig, SetConfigImpl } from "../../../../src/useCases";
import {
    MockChatEntity,
    MockChats,
    MockCommunicationPresenter,
    MockPersistence,
    MockTriggerGateway,
} from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
jest.mock("../../../../src/useCases/utils", () => ({
    createRecurrence: jest.fn().mockImplementation(x => x),
    convertChatToPersistence: jest.fn().mockReturnValue({ mock: "newChat" }),
}));
describe("SetConfig", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockTrigger: MockTriggerGateway;
    let mockPersistence: MockPersistence;
    let mockLogger: MockLogger;
    let useCase: SetConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockTrigger = new MockTriggerGateway(mockLogger);
        mockPersistence = new MockPersistence(mockLogger);
        mockLogger = new MockLogger();
        useCase = new SetConfigImpl(mockLogger, mockCommunication, mockTrigger, mockPersistence);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("execute", () => {
        it("should set a new time frame", async () => {
            await useCase.execute({
                chatId: "chat",
                userId: "user",
                triggerId: "trigger",
                config: {
                    frame: {
                        begin: { mock: "frame start" } as any,
                        end: { mock: "frame end" } as any,
                    },
                    recurrence: { mock: "recurrence" } as any,
                },
            });

            expect(MockChatEntity.setTrigger).toHaveBeenCalledWith(
                "trigger",
                {
                    frame: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                    },
                    recurrence: { mock: "recurrence" },
                },
                "user",
            );
            expect(mockTrigger.set).toHaveBeenCalledWith("chat", "trigger", { mock: "recurrence" });
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", { mock: "newChat" });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.SET_CONFIG,
                triggerId: "trigger",
            });
        });
        it("should send an error if chat was not initialized", async () => {
            MockChats.instance.getChat.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.CHAT_NOT_EXISTING);
            });
            await useCase.execute({
                chatId: "chat",
                userId: "user",
                triggerId: "trigger",
                config: {
                    frame: {
                        begin: { mock: "frame start" } as any,
                        end: { mock: "frame end" } as any,
                    },
                    recurrence: { mock: "recurrence" } as any,
                },
            });
            expect(MockChatEntity.setTrigger).not.toHaveBeenCalled();
            expect(mockTrigger.set).not.toHaveBeenCalled();
            expect(mockPersistence.saveChatConfig).not.toHaveBeenCalled();
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                hasError: true,
                key: MessageKey.SET_CONFIG,
                triggerId: "trigger",
                message: `{${EntityErrorCode.CHAT_NOT_EXISTING}}`,
            });
        });
    });
});
