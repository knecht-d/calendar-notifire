import { InitializeChat, InitializeChatImpl, MessageKey } from "../../../../src/useCases";
import { MockCommunicationPresenter, MockPersistence } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("InitializeChat", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockPersistence: MockPersistence;
    let mockLogger: MockLogger;
    let useCase: InitializeChat;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockPersistence = new MockPersistence(mockLogger);
        mockLogger = new MockLogger();
        useCase = new InitializeChatImpl(mockLogger, mockCommunication, mockPersistence);
    });
    describe("execute", () => {
        it("should create a new chat", async () => {
            await useCase.execute({ chatId: "chat", userId: "user" });
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", {
                administrators: ["mockAdmin"],
                timeFrames: {},
            });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", { key: MessageKey.INITIALIZE_CHAT });
        });
    });
});
