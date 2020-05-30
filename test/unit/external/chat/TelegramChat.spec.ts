/* eslint-disable @typescript-eslint/camelcase */
import { Telegraf, Telegram } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { TelegramChat } from "../../../../src/external";
import { ICommunicationIn } from "../../../../src/gateways";
import { MockCommunicationController } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

const TelegrafMock = (Telegraf as unknown) as jest.Mock<Telegraf<TelegrafContext>>;
jest.mock("telegraf");
describe("TelegramChat", () => {
    let chat: TelegramChat;
    let telegraf: Telegraf<TelegrafContext>;
    let communication: ICommunicationIn;
    let mockLogger: MockLogger;
    beforeEach(() => {
        TelegrafMock.mockClear();
        mockLogger = new MockLogger();
        chat = new TelegramChat(mockLogger, { botToken: "testToken" });
        telegraf = TelegrafMock.mock.instances[0];
        telegraf.telegram = new Telegram("testToken");
        communication = new MockCommunicationController(mockLogger);
    });
    describe("constructor", () => {
        it("should create a bot", () => {
            expect(TelegrafMock).toHaveBeenCalledWith("testToken");
            expect(TelegrafMock.mock.instances[0]).toBeDefined();
        });
    });
    describe("start", () => {
        it("should fail if chat was not initialized", () => {
            return expect(chat.start()).rejects.toEqual(new Error("Chat must be initialized!"));
        });
        it("should initialize all commands", async () => {
            chat.init(communication);
            await chat.start();
            expect(telegraf.start).toHaveBeenCalledWith(expect.any(Function));
            expect(telegraf.command).toHaveBeenCalledWith("set", expect.any(Function));
            expect(telegraf.command).toHaveBeenCalledWith("delete", expect.any(Function));
            expect(telegraf.command).toHaveBeenCalledWith("read", expect.any(Function));
            expect(telegraf.command).toHaveBeenCalledWith("addAdmin", expect.any(Function));
            expect(telegraf.command).toHaveBeenCalledWith("removeAdmin", expect.any(Function));
            expect(telegraf.launch).toHaveBeenCalled();
        });
    });
    describe("send", () => {
        it("should send a message to the given chat", async () => {
            await chat.send("chat", "message");
            expect(telegraf.telegram.sendMessage).toHaveBeenCalledWith("chat", "message");
        });
    });
    describe("command handlers", () => {
        type PartialContext = Partial<TelegrafContext>;
        type Callbacks = Partial<{
            start: (ctx: PartialContext) => void;
            set: (ctx: PartialContext) => void;
            delete: (ctx: PartialContext) => void;
            read: (ctx: PartialContext) => void;
            addAdmin: (ctx: PartialContext) => void;
            removeAdmin: (ctx: PartialContext) => void;
        }>;

        let callbacks: Callbacks = {};
        beforeEach(async () => {
            chat.init(communication);
            await chat.start();
            callbacks = (telegraf.command as jest.Mock).mock.calls.reduce((callbacks, call) => {
                callbacks[call[0]] = call[1];
                return callbacks;
            }, {});
            callbacks.start = (telegraf.start as jest.Mock).mock.calls[0][0];
        });

        function createContext({
            message = "",
            chat = { type: "private", id: 42 },
            from = { first_name: "John", id: 1337, is_bot: false, username: "johnny" },
            noChat = false,
            noFrom = false,
            noMessage = false,
        } = {}): PartialContext {
            return {
                chat: noChat ? undefined : chat,
                from: noFrom ? undefined : from,
                message: noMessage ? undefined : { message_id: 4711, date: new Date().getTime(), text: message, chat },
            };
        }

        describe("start", () => {
            it("should initialize the chat", () => {
                callbacks.start!(createContext());
                expect(communication.initChat).toHaveBeenCalledWith("42", "johnny");
            });
        });
        describe("set", () => {
            it("should set a trigger", () => {
                callbacks.set!(createContext({ message: "/set someTriggerPayload" }));
                expect(communication.set).toHaveBeenCalledWith("42", "johnny", "someTriggerPayload");
            });
        });
        describe("delete", () => {
            it("should delete a trigger", () => {
                callbacks.delete!(createContext({ message: "/delete someTriggerPayload" }));
                expect(communication.delete).toHaveBeenCalledWith("42", "johnny", "someTriggerPayload");
            });
        });
        describe("read", () => {
            it("should read the triggers", () => {
                callbacks.read!(createContext({ message: "/read" }));
                expect(communication.read).toHaveBeenCalledWith("42");
            });
        });
        describe("addAdmin", () => {
            it("should add an admin", () => {
                callbacks.addAdmin!(createContext({ message: "/addAdmin someUser" }));
                expect(communication.addAdmin).toHaveBeenCalledWith("42", "johnny", "someUser");
            });
        });
        describe("removeAdmin", () => {
            it("should remove an admin", () => {
                callbacks.removeAdmin!(createContext({ message: "/removeAdmin someUser" }));
                expect(communication.removeAdmin).toHaveBeenCalledWith("42", "johnny", "someUser");
            });
        });
        describe("fallbacks", () => {
            it("should use a fallback for the chatId if chatId is not given", () => {
                callbacks.start!(createContext({ chat: { type: "private", id: 0 } }));
                expect(communication.initChat).toHaveBeenCalledWith("noChat", "johnny");
            });
            it("should use a fallback for the chatId if chat is not given", () => {
                callbacks.start!(createContext({ noChat: true }));
                expect(communication.initChat).toHaveBeenCalledWith("noChat", "johnny");
            });
            it("should use a fallback for the user if username is not given", () => {
                callbacks.start!(
                    createContext({ from: { first_name: "John", id: 1337, is_bot: false, username: "" } }),
                );
                expect(communication.initChat).toHaveBeenCalledWith("42", "noUser");
            });
            it("should use a fallback for the user if from is not given", () => {
                callbacks.start!(createContext({ noFrom: true }));
                expect(communication.initChat).toHaveBeenCalledWith("42", "noUser");
            });
            it("should use a fallback for the message if text is not given", () => {
                callbacks.addAdmin!(createContext({ message: "" }));
                expect(communication.addAdmin).toHaveBeenCalledWith("42", "johnny", "");
            });

            it("should use a fallback for the message if message is not given", () => {
                callbacks.addAdmin!(createContext({ noMessage: true }));
                expect(communication.addAdmin).toHaveBeenCalledWith("42", "johnny", "");
            });
        });
    });
});
