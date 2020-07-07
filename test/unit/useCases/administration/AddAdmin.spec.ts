import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { AddAdmin, AddAdminImpl, MessageKey } from "../../../../src/useCases";
import { MockChatEntity, MockChats, MockCommunicationPresenter, MockPersistence } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("AddAdmin", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockPersistence: MockPersistence;
    let mockLogger: MockLogger;
    let useCase: AddAdmin;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockPersistence = new MockPersistence(mockLogger);
        mockLogger = new MockLogger();
        useCase = new AddAdminImpl(mockLogger, mockCommunication, mockPersistence);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("execute", () => {
        it("should add an admin", async () => {
            await useCase.execute({ chatId: "chat", userId: "user", adminId: "admin" });
            expect(MockChatEntity.addAdmin).toHaveBeenCalledWith("user", "admin");
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", {
                administrators: ["mockAdmin"],
                triggerSettings: {},
            });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.ADD_ADMIN,
                newAdmin: "admin",
            });
        });
        it("should send an error if chat was not initialized", async () => {
            MockChats.instance.getChat.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.CHAT_NOT_EXISTING);
            });
            await useCase.execute({ chatId: "chat", userId: "user", adminId: "admin" });
            expect(MockChatEntity.addAdmin).not.toHaveBeenCalled();
            expect(mockPersistence.saveChatConfig).not.toHaveBeenCalled();
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                hasError: true,
                key: MessageKey.ADD_ADMIN,
                newAdmin: "admin",
                message: `{${EntityErrorCode.CHAT_NOT_EXISTING}}`,
            });
        });
    });
});
