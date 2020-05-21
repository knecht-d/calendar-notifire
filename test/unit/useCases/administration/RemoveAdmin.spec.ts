import { MessageKey, RemoveAdmin, RemoveAdminImpl } from "../../../../src/useCases";
import { MockChatEntity, MockCommunicationPresenter, MockPersistence } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("RemoveAdmin", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockPersistence: MockPersistence;
    let mockLogger: MockLogger;
    let useCase: RemoveAdmin;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockPersistence = new MockPersistence(mockLogger);
        mockLogger = new MockLogger();
        useCase = new RemoveAdminImpl(mockLogger, mockCommunication, mockPersistence);
    });
    describe("execute", () => {
        it("should remove an admin", async () => {
            await useCase.execute({ chatId: "chat", userId: "user", adminId: "admin" });
            expect(MockChatEntity.removeAdmin).toHaveBeenCalledWith("user", "admin");
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", {
                administrators: ["mockAdmin"],
                timeFrames: {},
            });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.REMOVE_ADMIN,
                oldAdmin: "admin",
            });
        });
    });
});
