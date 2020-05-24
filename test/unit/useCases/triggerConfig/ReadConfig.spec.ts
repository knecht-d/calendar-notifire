import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { MessageKey, ReadConfig, ReadConfigImpl } from "../../../../src/useCases";
import { MockChatEntity, MockChats, MockCommunicationPresenter } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks/Entities").MockChats;
    return {
        Chats: MockChats,
    };
});
jest.mock("../../../../src/useCases/utils", () => ({
    convertRecurrence: jest.fn().mockImplementation(x => x),
}));
describe("ReadConfig", () => {
    let mockCommunication: MockCommunicationPresenter;
    let mockLogger: MockLogger;
    let useCase: ReadConfig;
    beforeAll(() => {
        mockCommunication = new MockCommunicationPresenter(mockLogger);
        mockLogger = new MockLogger();
        useCase = new ReadConfigImpl(mockLogger, mockCommunication);
    });
    describe("execute", () => {
        it("pass the config", async () => {
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
            await useCase.execute({ chatId: "chat" });
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
        it("should send an error if chat was not initialized", async () => {
            MockChats.instance.getChat.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.CHAT_NOT_EXISTING);
            });
            await useCase.execute({ chatId: "chat" });
            expect(mockCommunication.send).toHaveBeenCalledWith("chat", {
                hasError: true,
                key: MessageKey.READ_CONFIG,
                timeFrames: {},
                message: `{${EntityErrorCode.CHAT_NOT_EXISTING}}`,
            });
        });
    });
});
