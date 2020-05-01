import { Chats } from "./Chats";
import { Chat } from "./Chat";

jest.mock("./Chat", () => {
    // Works and lets you check for constructor calls:
    return {
        Chat: jest.fn().mockImplementation(() => {
            return { chat: "mock" };
        }),
    };
});
const chatMock = Chat as jest.Mock<Chat>;

describe("Chats", () => {
    beforeEach(() => {
        chatMock.mockClear();
    });
    it("should return always the same insatance chats instance", () => {
        const chats1 = Chats.instance;
        const chats2 = Chats.instance;
        expect(chats1).toBe(chats2);
    });
    it("should create a new chat", () => {
        const chats = Chats.instance;
        expect(chats.getChat("test")).toBeDefined();
    });
    it("should always return the same chat", () => {
        const chats = Chats.instance;
        const chat1 = chats.getChat("test2");
        const chat2 = chats.getChat("test2");
        expect(chat1).toBe(chat2);
        expect(chatMock).toHaveBeenCalledTimes(1);
    });
    it("should return the chats as JSON", () => {
        const chats = Chats.instance;
        chats.getChat("test");
        chats.getChat("test2");
        expect(chats.toJSON()).toEqual({ chats: { test: { chat: "mock" }, test2: { chat: "mock" } } });
    });
});
