import { MessageKey, SetConfig, SetConfigImpl } from "../../../../src/useCases";
import { MockChatEntity, MockCommunicationPresenter, MockPersistence, MockTriggerGateway } from "../../../mocks";

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
    let useCase: SetConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        mockTrigger = new MockTriggerGateway();
        mockPersistence = new MockPersistence();
        useCase = new SetConfigImpl(mockCommunication, mockTrigger, mockPersistence);
    });
    describe("execute", () => {
        it("should set a new time frame", async () => {
            await useCase.execute({
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
    });
});
