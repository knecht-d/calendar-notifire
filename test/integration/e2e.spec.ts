import { Builder } from "../../src/creation";
import { ILogger, LogLevels } from "../../src/external";
import { MockCalendar, MockChat, MockFactory, MockStorage, MockTimer } from "../mocks";

let calendar: MockCalendar;
let chat: MockChat;
let storage: MockStorage;
let timer: MockTimer;
jest.mock("../mocks", () => {
    const actual = jest.requireActual("../mocks");
    return {
        ...actual,
        MockFactory: jest.fn().mockImplementation(() => ({
            createCalendar: (logger: ILogger, setupData: any) => {
                calendar = new actual.MockCalendar(logger, setupData);
                return calendar;
            },
            createChat: (logger: ILogger, setupData: any) => {
                chat = new actual.MockChat(logger, setupData);
                return chat;
            },
            createStorage: (logger: ILogger, setupData: any) => {
                storage = new actual.MockStorage(logger, setupData);
                return storage;
            },
            createTimer: (logger: ILogger, setupData: any) => {
                timer = new actual.MockTimer(logger, setupData);
                return timer;
            },
        })),
    };
});
describe("End to end test", () => {
    beforeAll(() => {
        const mockFactory = new MockFactory();
        const builder = new Builder(mockFactory);
        builder.build({ calendar: { events: [] }, chatData: {}, storage: {}, loggger: { level: LogLevels.error } });
    });
    beforeEach(() => {
        chat.send.mockClear();
    });
    it("set trigger should fail if chat is not initialized", async () => {
        await chat.fireSet("chat1", "user1", "trigger1 m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0");
        expect(chat.send).toHaveBeenCalledTimes(1);
        expect(chat.send).toHaveBeenCalledWith("chat1", "Fehler: Error: CHAT_NOT_EXISTING: {}");
    });
    it("chat should be initialized", async () => {
        await chat.fireInitChat("chat1", "user1");
        expect(chat.send).toHaveBeenCalledTimes(1);
        expect(chat.send).toHaveBeenCalledWith("chat1", "Initialisierung des Chats erfolgreich.");
    });
    it("set trigger should succeed if chat is initialized", async () => {
        await chat.fireSet("chat1", "user1", "trigger1 m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0");
        expect(chat.send).toHaveBeenCalledTimes(1);
        expect(chat.send).toHaveBeenCalledWith("chat1", "Setzen von trigger1 erfolgreich.");
    });
    it("should send the events if a trigger fires", async () => {
        await timer.fireTrigger("chat1|trigger1");
        expect(chat.send).toHaveBeenCalledTimes(1);
        expect(chat.send).toHaveBeenCalledWith("chat1", "Termine: []");
    });
});
