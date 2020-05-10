import { Chats } from "../../src/entities/";
import { Chat } from "../../src/entities/Chat";
import { EntityError, EntityErrorCode } from "../../src/entities/EntityError";

jest.mock("../../src/entities/Chat", () => {
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
    it("should fail if chat is not created", () => {
        const chats = Chats.instance;
        expect(() => {
            chats.getChat("test");
        }).toThrow(new EntityError(EntityErrorCode.CHAT_NOT_EXISTING));
    });
    it("should fail if chat created twice", () => {
        const chats = Chats.instance;
        expect(() => {
            chats.createChat("test", ["admin"]);
            chats.createChat("test", ["another admin"]);
        }).toThrow(new EntityError(EntityErrorCode.CHAT_ALREADY_EXISTING));
    });
    it("should always return the same chat", () => {
        const chats = Chats.instance;
        chats.createChat("test2", ["admin"]);
        const chat1 = chats.getChat("test2");
        const chat2 = chats.getChat("test2");
        expect(chat1).toBe(chat2);
        expect(chatMock).toHaveBeenCalledTimes(1);
    });
    it("should return the chats as JSON", () => {
        const chats = Chats.instance;
        try {
            chats.createChat("test", ["admin"]);
        } catch (error) {
            // Chat was already existing
        }
        try {
            chats.createChat("test2", ["admin"]);
        } catch (error) {
            // Chat was already existing
        }
        expect(chats.toJSON()).toEqual({ chats: { test: { chat: "mock" }, test2: { chat: "mock" } } });
    });
});
