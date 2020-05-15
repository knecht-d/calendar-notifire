import { MessageKey, ReadConfig, ReadConfigImpl } from "../../../src/useCases";
import { MockChatEntity, MockCommunicationPresenter } from "../../mocks";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks/Entities").MockChats;
    return {
        Chats: MockChats,
    };
});
jest.mock("../../../src/useCases/utils", () => ({
    convertRecurrence: jest.fn().mockImplementation(x => x),
}));
describe("ReadConfig", () => {
    let mockCommunication: MockCommunicationPresenter;
    let useCase: ReadConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        useCase = new ReadConfigImpl(mockCommunication);
    });
    describe("execute", () => {
        it("pass the config", () => {
            const settings = [
                {
                    key: "frame1",
                    frame: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                    },
                    recurrence: { mock: "recurrence" },
                },
                {
                    key: "frame2",
                    frame: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                    },
                    recurrence: { mock: "recurrence" },
                },
            ];
            MockChatEntity.getConfig.mockReturnValue({
                settings,
                administrators: ["admin1", "admin2"],
            });
            useCase.execute({ chatId: "chat" });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                key: MessageKey.READ_CONFIG,
                timeFrames: {
                    frame1: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                        recurrence: { mock: "recurrence" },
                    },
                    frame2: {
                        begin: { mock: "frame start" },
                        end: { mock: "frame end" },
                        recurrence: { mock: "recurrence" },
                    },
                },
            });
        });
    });
});
