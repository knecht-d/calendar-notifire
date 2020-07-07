/* eslint-disable @typescript-eslint/camelcase */
import { Telegraf, Telegram } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { TelegramChat } from "../../../../../src/external";
import { FrameConfigBuilder, TriggerConfigBuilder } from "../../../../../src/external/chat/telegram/conversation";
import { ICommunicationIn } from "../../../../../src/gateways";
import { MockCommunicationController } from "../../../../mocks";
import { MockLogger } from "../../../../mocks/external/MockLogger";

const TelegrafMock = (Telegraf as unknown) as jest.Mock<Telegraf<TelegrafContext>>;
jest.mock("telegraf");
jest.mock("../../../../../src/external/chat/telegram/conversation/TriggerConfigBuilder");
jest.mock("../../../../../src/external/chat/telegram/conversation/FrameConfigBuilder");
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
            start: (ctx: PartialContext) => Promise<void>;
            set: (ctx: PartialContext) => Promise<void>;
            delete: (ctx: PartialContext) => Promise<void>;
            read: (ctx: PartialContext) => Promise<void>;
            addAdmin: (ctx: PartialContext) => Promise<void>;
            removeAdmin: (ctx: PartialContext) => Promise<void>;
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
                message: noMessage ? undefined : { message_id: 4711, date: 1594157543675, text: message, chat },
                reply: jest.fn(() => Promise.resolve({ message_id: 4711, date: 1594157543675, text: message, chat })),
            };
        }

        describe("start", () => {
            it("should initialize the chat", async () => {
                await callbacks.start!(createContext());
                expect(communication.initChat).toHaveBeenCalledWith("42", "1337");
            });
        });
        describe("set", () => {
            beforeEach(() => {
                const triggerBuilder = (TriggerConfigBuilder as unknown) as jest.Mock;
                triggerBuilder.mockImplementation(() => ({
                    requestConfig: jest.fn(() => Promise.resolve({ trigger: "config" })),
                    getConfig: jest.fn(() => ({ trigger: "config" })),
                }));
                const frameConfigBuilder = (FrameConfigBuilder as unknown) as jest.Mock;
                frameConfigBuilder.mockImplementation(() => ({
                    requestConfig: jest.fn(() => Promise.resolve({ frame: "config" })),
                    getConfig: jest.fn(() => ({ frame: "config" })),
                }));
            });
            it("should set a trigger", async done => {
                (communication.set as jest.Mock).mockImplementationOnce(() => {
                    expect(communication.set).toHaveBeenCalledWith("42", "1337", "someTriggerPayload", {
                        recurrence: { trigger: "config" },
                        frame: {
                            begin: {},
                            end: { frame: "config" },
                        },
                    });
                    done();
                });
                await callbacks.set!(createContext({ message: "/set someTriggerPayload" }));
            });
            it("should send an error if trigger id is missing", async () => {
                const ctx = createContext({ message: "/set " });
                await callbacks.set!(ctx);
                expect(ctx.reply).toHaveBeenCalledWith("Trigger Id fehlt!");
            });
        });
        describe("delete", () => {
            it("should delete a trigger", async () => {
                await callbacks.delete!(createContext({ message: "/delete someTriggerPayload" }));
                expect(communication.delete).toHaveBeenCalledWith("42", "1337", "someTriggerPayload");
            });
        });
        describe("read", () => {
            it("should read the triggers", async () => {
                await callbacks.read!(createContext({ message: "/read" }));
                expect(communication.read).toHaveBeenCalledWith("42");
            });
        });
        describe("addAdmin", () => {
            it("should add an admin", async () => {
                await callbacks.addAdmin!(createContext({ message: "/addAdmin someUser" }));
                expect(communication.addAdmin).toHaveBeenCalledWith("42", "1337", "someUser");
            });
        });
        describe("removeAdmin", () => {
            it("should remove an admin", async () => {
                await callbacks.removeAdmin!(createContext({ message: "/removeAdmin someUser" }));
                expect(communication.removeAdmin).toHaveBeenCalledWith("42", "1337", "someUser");
            });
        });
        describe("missing properties", () => {
            it("should cancel and send an error if chatId is not given", async () => {
                const ctx = createContext({ chat: { type: "private", id: 0 } });
                await callbacks.start!(ctx);
                expect(mockLogger.error).toHaveBeenCalledWith(
                    "TelegramChat",
                    new Error(
                        'Wrong ChatId: {"chat":{"type":"private","id":0},"from":{"first_name":"John","id":1337,"is_bot":false,"username":"johnny"},"message":{"message_id":4711,"date":1594157543675,"text":"","chat":{"type":"private","id":0}}}',
                    ),
                );
                expect(ctx.reply).toHaveBeenCalledWith("Fehlerhafte ChatId");
                expect(communication.initChat).not.toHaveBeenCalled();
            });
            it("should cancel and send an error if chat is not given", async () => {
                const ctx = createContext({ noChat: true });
                await callbacks.start!(ctx);
                expect(mockLogger.error).toHaveBeenCalledWith(
                    "TelegramChat",
                    new Error(
                        'Wrong ChatId: {"from":{"first_name":"John","id":1337,"is_bot":false,"username":"johnny"},"message":{"message_id":4711,"date":1594157543675,"text":"","chat":{"type":"private","id":42}}}',
                    ),
                );
                expect(ctx.reply).toHaveBeenCalledWith("Fehlerhafte ChatId");
                expect(communication.initChat).not.toHaveBeenCalled();
            });
            it("should cancel and send an error if userid is not given", async () => {
                const ctx = createContext({ from: { first_name: "John", id: 0, is_bot: false, username: "johnny" } });
                await callbacks.start!(ctx);
                expect(mockLogger.error).toHaveBeenCalledWith(
                    "TelegramChat",
                    new Error(
                        'Wrong UserId: {"chat":{"type":"private","id":42},"from":{"first_name":"John","id":0,"is_bot":false,"username":"johnny"},"message":{"message_id":4711,"date":1594157543675,"text":"","chat":{"type":"private","id":42}}}',
                    ),
                );
                expect(ctx.reply).toHaveBeenCalledWith("Fehlerhafte UserId");
                expect(communication.initChat).not.toHaveBeenCalled();
            });
            it("should cancel and send an error if from is not given", async () => {
                const ctx = createContext({ noFrom: true });
                await callbacks.start!(ctx);
                expect(mockLogger.error).toHaveBeenCalledWith(
                    "TelegramChat",
                    new Error(
                        'Wrong UserId: {"chat":{"type":"private","id":42},"message":{"message_id":4711,"date":1594157543675,"text":"","chat":{"type":"private","id":42}}}',
                    ),
                );
                expect(ctx.reply).toHaveBeenCalledWith("Fehlerhafte UserId");
                expect(communication.initChat).not.toHaveBeenCalled();
            });

            it("should use a fallback for the message if text is not given", async () => {
                await callbacks.addAdmin!(createContext({ message: "" }));
                expect(communication.addAdmin).toHaveBeenCalledWith("42", "1337", "");
            });

            it("should use a fallback for the message if message is not given", async () => {
                await callbacks.addAdmin!(createContext({ noMessage: true }));
                expect(communication.addAdmin).toHaveBeenCalledWith("42", "1337", "");
            });
        });
    });
});
