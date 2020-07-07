import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { InitializeChat, InitializeChatImpl, MessageKey } from "../../../../src/useCases";
import { MockChats, MockCommunicationPresenter, MockPersistence } from "../../../mocks";
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
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("execute", () => {
        it("should create a new chat", async () => {
            await useCase.execute({ chatId: "chat", userId: "user" });
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", {
                administrators: ["mockAdmin"],
                triggerSettings: {},
            });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", { key: MessageKey.INITIALIZE_CHAT });
        });
        it("should fail to create a new chat if it is already existing", async () => {
            MockChats.instance.createChat.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.CHAT_ALREADY_EXISTING);
            });
            await useCase.execute({ chatId: "chat", userId: "user" });
            expect(mockPersistence.saveChatConfig).not.toHaveBeenCalled();
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                hasError: true,
                key: MessageKey.INITIALIZE_CHAT,
                message: `{${EntityErrorCode.CHAT_ALREADY_EXISTING}}`,
            });
        });
    });
});
