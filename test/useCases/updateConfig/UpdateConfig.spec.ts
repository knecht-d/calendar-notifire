import { UpdateConfig, UpdateConfigImpl } from "../../../src/useCases";
import { MockCommunicationPresenter, MockPersistence, MockTriggerGateway, MockChatEntity } from "../../mocks";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("InitializeChat", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockTrigger: MockTriggerGateway;
    let mockPersistence: MockPersistence;
    let useCase: UpdateConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        mockTrigger = new MockTriggerGateway();
        mockPersistence = new MockPersistence();
        useCase = new UpdateConfigImpl(mockCommunication, mockTrigger, mockPersistence);
    });
    describe("execute", () => {
        it("should create a new chat", () => {
            useCase.execute({
                chatId: "chat",
                userId: "user",
                triggerId: "trigger",
                config: {
                    frameStart: { mock: "frame start" },
                    frameEnd: { mock: "frame end" },
                    recurrence: { mock: "recurrence" },
                },
            } as any);

            expect(MockChatEntity.setTimeFrame).toHaveBeenCalledWith(
                "trigger",
                {
                    begin: { mock: "frame start" },
                    end: { mock: "frame end" },
                    recurrence: { mock: "recurrence" },
                },
                "user",
            );
            expect(mockTrigger.update).toHaveBeenCalledWith("chat", "trigger", { mock: "recurrence" });
            expect(mockPersistence.saveChatConfig).toHaveBeenCalledWith("chat", { mock: "newChat" });
            expect(mockCommunication.sendUpdateSuccess).toHaveBeenCalledWith("chat", "trigger");
        });
    });
});
