import { InitializeChat, InitializeChatImpl } from "../../../src/useCases";
import { MockCommunicationPresenter, MockPersistence } from "../../mocks";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("InitializeChat", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockPersistence: MockPersistence;
    let useCase: InitializeChat;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        mockPersistence = new MockPersistence();
        useCase = new InitializeChatImpl(mockCommunication, mockPersistence);
    });
    describe("execute", () => {
        it("should create a new chat", () => {
            useCase.execute({ chatId: "chat", userId: "user" });
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", { mock: "newChat" });
            expect(mockCommunication.sendInitSuccess).toHaveBeenCalledWith("chat");
        });
    });
});
