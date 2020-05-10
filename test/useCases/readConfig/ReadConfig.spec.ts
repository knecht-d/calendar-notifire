import { MockCommunicationPresenter, MockChatEntity } from "../../mocks";
import { ReadConfig, ReadConfigImpl } from "../../../src/useCases";

jest.mock("../../../src/entities/Chats", () => {
    const MockChats = require("../../mocks/Entities").MockChats;
    return {
        Chats: MockChats,
    };
});
describe("ReadConfig", () => {
    let mockCommunication: MockCommunicationPresenter;
    let useCase: ReadConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter();
        useCase = new ReadConfigImpl(mockCommunication);
    });
    describe("execute", () => {
        it("pass the config", () => {
            const frames = {
                frame1: {
                    frameStart: { mock: "frame start" },
                    frameEnd: { mock: "frame end" },
                    recurrence: { mock: "recurrence" },
                },
                frame2: {
                    frameStart: { mock: "frame start" },
                    frameEnd: { mock: "frame end" },
                    recurrence: { mock: "recurrence" },
                },
            };
            MockChatEntity.toJSON.mockReturnValue({
                timeFrames: frames,
                administrators: ["admin1", "admin2"],
            });
            useCase.execute({ chatId: "chat" });
            expect(mockCommunication.sendReadConfig).toHaveBeenCalledWith("chat", frames);
        });
    });
});
