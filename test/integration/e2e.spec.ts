import { Builder } from "../../src/creation";
import { EntityError, EntityErrorCode } from "../../src/entities/EntityError";
import { ILogger, Logger, LogLevels } from "../../src/external";
import { MockCalendar, MockChat, MockFactory, MockStorage, MockTimer } from "../mocks";

let logger: Logger;
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
jest.mock("../../src/external/logging");
describe("End to end test", () => {
    beforeAll(() => {
        const mockFactory = new MockFactory();
        const builder = new Builder(mockFactory);
        builder.build({ calendar: { events: [] }, chatData: {}, storage: {}, loggger: { level: LogLevels.error } });
        logger = (Logger as jest.Mock<Logger>).mock.instances[0];
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("initialization", () => {
        describe("Not initialized", () => {
            describe("admin use cases", () => {
                it("add admin should fail if chat is not initialized", async () => {
                    await chat.fireAddAdmin("chat1", "user1", "user2");
                    expect(chat.send).toHaveBeenCalledTimes(1);
                    expect(chat.send).toHaveBeenCalledWith(
                        "chat1",
                        "Hinzufügen von user2 zu Administratoren fehlgeschlagen. {CHAT_NOT_EXISTING}",
                    );
                    expect(storage.storedData).toEqual({});
                });
                it("remove admin should fail if chat is not initialized", async () => {
                    await chat.fireRemoveAdmin("chat1", "user1", "user2");
                    expect(chat.send).toHaveBeenCalledTimes(1);
                    expect(chat.send).toHaveBeenCalledWith(
                        "chat1",
                        "Entfernen von user2 aus Administratoren fehlgeschlagen. {CHAT_NOT_EXISTING}",
                    );
                    expect(storage.storedData).toEqual({});
                });
            });
            describe("reminder use case", () => {
                it("reminder should fail if chat is not initialized", async () => {
                    await timer.fireTrigger("chat1|trigger1");
                    expect(chat.send).not.toHaveBeenCalled();
                    expect(logger.error).toHaveBeenCalledWith(
                        "ReminderImpl",
                        new EntityError(EntityErrorCode.CHAT_NOT_EXISTING),
                    );
                });
            });
            describe("trigger use cases", () => {
                it("delete trigger should fail if chat is not initialized", async () => {
                    await chat.fireDelete("chat1", "user1", "trigger1");
                    expect(chat.send).toHaveBeenCalledTimes(1);
                    expect(chat.send).toHaveBeenCalledWith(
                        "chat1",
                        "Löschen von trigger1 fehlgeschlagen. {CHAT_NOT_EXISTING}",
                    );
                    expect(storage.storedData).toEqual({});
                });
                it("read trigger should fail if chat is not initialized", async () => {
                    await chat.fireRead("chat1");
                    expect(chat.send).toHaveBeenCalledTimes(1);
                    expect(chat.send).toHaveBeenCalledWith(
                        "chat1",
                        "Lesen der Konfiguration fehlgeschlagen. {CHAT_NOT_EXISTING}",
                    );
                    expect(storage.storedData).toEqual({});
                });
                it("set trigger should fail if chat is not initialized", async () => {
                    await chat.fireSet("chat1", "user1", "trigger1 m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0");
                    expect(chat.send).toHaveBeenCalledTimes(1);
                    expect(chat.send).toHaveBeenCalledWith(
                        "chat1",
                        "Setzen von trigger1 fehlgeschlagen. {CHAT_NOT_EXISTING}",
                    );
                    expect(storage.storedData).toEqual({});
                });
            });
        });

        it("chat should be initialized", async () => {
            await chat.fireInitChat("chat1", "user1");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Initialisierung des Chats erfolgreich.");
            expect(storage.storedData).toEqual({ chat1: '{"administrators":["user1"],"timeFrames":{}}' });
        });
        it("chat should not be initialized twice", async () => {
            await chat.fireInitChat("chat1", "anotherUser");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith(
                "chat1",
                "Initialisierung des Chats fehlgeschlagen. {CHAT_ALREADY_EXISTING}",
            );
            expect(storage.storedData).toEqual({ chat1: '{"administrators":["user1"],"timeFrames":{}}' });
        });
    });

    describe("admins", () => {
        it("should add a new admin", async () => {
            await chat.fireAddAdmin("chat1", "user1", "user2");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "user2 erfolgreich zu Administratoren hinzugefügt.");
            expect(storage.storedData).toEqual({
                chat1: '{"administrators":["user1","user2"],"timeFrames":{}}',
            });
        });
        it("should fail to add a new admin if current user is not an admin", async () => {
            await chat.fireAddAdmin("chat1", "noAdmin", "user3");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith(
                "chat1",
                "Hinzufügen von user3 zu Administratoren fehlgeschlagen. {MISSING_PRIVILEGES}",
            );
            expect(storage.storedData).toEqual({
                chat1: '{"administrators":["user1","user2"],"timeFrames":{}}',
            });
        });
        it("should fail to remove an admin if current user is not an admin", async () => {
            await chat.fireRemoveAdmin("chat1", "noAdmin", "user1");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith(
                "chat1",
                "Entfernen von user1 aus Administratoren fehlgeschlagen. {MISSING_PRIVILEGES}",
            );
            expect(storage.storedData).toEqual({
                chat1: '{"administrators":["user1","user2"],"timeFrames":{}}',
            });
        });
        it("should fail to remove an admin if to be removed user is not an admin", async () => {
            await chat.fireRemoveAdmin("chat1", "user1", "noAdmin");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith(
                "chat1",
                "Entfernen von noAdmin aus Administratoren fehlgeschlagen. {NO_ADMIN}",
            );
            expect(storage.storedData).toEqual({
                chat1: '{"administrators":["user1","user2"],"timeFrames":{}}',
            });
        });
        it("should remove an admin", async () => {
            await chat.fireRemoveAdmin("chat1", "user1", "user2");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "user2 erfolgreich von Administratoren entfernt.");
            expect(storage.storedData).toEqual({
                chat1: '{"administrators":["user1"],"timeFrames":{}}',
            });
        });
        it("should fail to remove an admin if it is the last one", async () => {
            await chat.fireRemoveAdmin("chat1", "user1", "user1");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith(
                "chat1",
                "Entfernen von user1 aus Administratoren fehlgeschlagen. {LAST_ADMIN}",
            );
            expect(storage.storedData).toEqual({
                chat1: '{"administrators":["user1"],"timeFrames":{}}',
            });
        });
    });

    describe("trigger settings", () => {
        it("should set a new trigger", async () => {
            await chat.fireSet("chat1", "user1", "trigger1 m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Setzen von trigger1 erfolgreich.");
            expect(timer.triggers["chat1|trigger1"]).toEqual("30 17 15 * *");
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":30}}}}',
            });
        });
        it("should fail to set a new trigger if user is not an admin", async () => {
            await chat.fireSet("chat1", "noAdmin", "trigger2 m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Setzen von trigger2 fehlgeschlagen. {MISSING_PRIVILEGES}");
            expect(timer.triggers["chat1|trigger2"]).toBeUndefined();
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":30}}}}',
            });
        });
        it("should update an existing trigger", async () => {
            await chat.fireSet("chat1", "user1", "trigger1 m 15 17:45 M+1,t1,s0,m0 M+2,t1,s0,m0");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Setzen von trigger1 erfolgreich.");
            expect(timer.triggers["chat1|trigger1"]).toEqual("45 17 15 * *");
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":45}}}}',
            });
        });
        it("should add a additional trigger", async () => {
            await chat.fireSet("chat1", "user1", "trigger2 m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Setzen von trigger2 erfolgreich.");
            expect(timer.triggers["chat1|trigger1"]).toEqual("45 17 15 * *");
            expect(timer.triggers["chat1|trigger2"]).toEqual("30 17 15 * *");
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":45}},"trigger2":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":30}}}}',
            });
        });
        it("should delete an existing trigger", async () => {
            await chat.fireDelete("chat1", "user1", "trigger2");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Löschen von trigger2 erfolgreich.");
            expect(timer.triggers["chat1|trigger1"]).toEqual("45 17 15 * *");
            expect(timer.triggers["chat1|trigger2"]).toBeUndefined();
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":45}}}}',
            });
        });
        it("should fail to delete an existing trigger if user is not an admin", async () => {
            await chat.fireDelete("chat1", "nonAdmin", "trigger1");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith(
                "chat1",
                "Löschen von trigger1 fehlgeschlagen. {MISSING_PRIVILEGES}",
            );
            expect(timer.triggers["chat1|trigger1"]).toEqual("45 17 15 * *");
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":45}}}}',
            });
        });
        it("should read the config even if user is not an admin", async () => {
            await chat.fireRead("chat1");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toMatchSnapshot();
        });
    });

    describe("reminder", () => {
        it("should send the events if a trigger fires", async () => {
            await timer.fireTrigger("chat1|trigger1");
            expect(chat.send).toHaveBeenCalledTimes(1);
            expect(chat.send).toHaveBeenCalledWith("chat1", "Termine: []");
            expect(storage.storedData).toEqual({
                chat1:
                    '{"administrators":["user1"],"timeFrames":{"trigger1":{"begin":{"month":{"value":1,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"end":{"month":{"value":2,"fixed":false},"day":{"value":1,"fixed":true},"hour":{"value":0,"fixed":true},"minute":{"value":0,"fixed":true}},"recurrence":{"type":"m","day":15,"hour":17,"minute":45}}}}',
            });
        });
    });
});
