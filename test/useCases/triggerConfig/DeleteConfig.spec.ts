import { DeleteConfig, DeleteConfigImpl, MessageKey } from "../../../src/useCases";
import { MockChatEntity, MockCommunicationPresenter, MockPersistence, MockTriggerGateway } from "../../mocks";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks/Entities").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("InitializeChat", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockTrigger: MockTriggerGateway;
    let mockPersistence: MockPersistence;
    let useCase: DeleteConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        mockTrigger = new MockTriggerGateway();
        mockPersistence = new MockPersistence();
        useCase = new DeleteConfigImpl(mockCommunication, mockTrigger, mockPersistence);
    });
    describe("execute", () => {
        it("should remove and stop the timer", () => {
            useCase.execute({
                chatId: "chat",
                userId: "user",
                triggerId: "trigger",
            });

            expect(MockChatEntity.removeTimeFrame).toHaveBeenCalledWith("trigger", "user");
            expect(mockTrigger.stop).toHaveBeenCalledWith("chat", "trigger");
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", {
                administrators: ["mockAdmin"],
                timeFrames: {},
            });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.DELETE_CONFIG,
                triggerId: "trigger",
            });
        });
    });
});
