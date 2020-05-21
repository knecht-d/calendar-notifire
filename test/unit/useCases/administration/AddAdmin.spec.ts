import { AddAdmin, AddAdminImpl, MessageKey } from "../../../../src/useCases";
import { MockChatEntity, MockCommunicationPresenter, MockPersistence } from "../../../mocks";
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
    describe("execute", () => {
        it("should add an admin", async () => {
            await useCase.execute({ chatId: "chat", userId: "user", adminId: "admin" });
            expect(MockChatEntity.addAdmin).toHaveBeenCalledWith("user", "admin");
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", {
                administrators: ["mockAdmin"],
                timeFrames: {},
            });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.ADD_ADMIN,
                newAdmin: "admin",
            });
        });
    });
});
