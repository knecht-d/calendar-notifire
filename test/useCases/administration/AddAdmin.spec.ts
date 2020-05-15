import { AddAdmin, AddAdminImpl, MessageKey } from "../../../src/useCases";
import { MockChatEntity, MockCommunicationPresenter, MockPersistence } from "../../mocks";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("AddAdmin", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockPersistence: MockPersistence;
    let useCase: AddAdmin;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        mockPersistence = new MockPersistence();
        useCase = new AddAdminImpl(mockCommunication, mockPersistence);
    });
    describe("execute", () => {
        it("should add an admin", () => {
            useCase.execute({ chatId: "chat", userId: "user", adminId: "admin" });
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
