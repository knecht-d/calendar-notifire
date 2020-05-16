// import { Mappings } from "./Mappings";

import { CommunicationPresenter } from "../../../../src/gateways";
import { CommunicationError } from "../../../../src/gateways/communication/CommunicationError";
import { MessageKey } from "../../../../src/useCases";

jest.mock("../../../../src/gateways/communication/Mappings", () => {
    // Works and lets you check for constructor calls:
    return {
        Mappings: {
            errorCodes: {
                GIVEN_EXPECTED_EXAMPLE: "Some Code: Given [{given}] Expected: {expected} Example: {example}",
                NO_EXAMPLE: "Some Code: Given [{given}] Expected: {expected}",
                NO_EXPECTED: "Some Code: Given [{given}] Example: {example}",
                DUPLICATE_GIVEN: "Some Code: Given [{given}] Expected: {expected} Given [{given}]",
            },
            successMessages: {
                ADD_ADMIN: "Succ - ADD_ADMIN {newAdmin}{message}",
                REMOVE_ADMIN: "Succ - REMOVE_ADMIN {oldAdmin}{message}",
                SET_CONFIG: "Succ - SET_CONFIG {triggerId}{message}",
                DELETE_CONFIG: "Succ - DELETE_CONFIG {triggerId}{message}",
                READ_CONFIG: "Succ - READ_CONFIG {timeFrames}{message}",
                INITIALIZE_CHAT: "Succ - INITIALIZE_CHAT{message}",
                EVENTS: "Succ - EVENTS {events}{message}",
            },
            errorMessages: {
                ADD_ADMIN: "Err - ADD_ADMIN {newAdmin}{message}",
                REMOVE_ADMIN: "Err - REMOVE_ADMIN {oldAdmin}{message}",
                SET_CONFIG: "Err - SET_CONFIG {triggerId}{message}",
                DELETE_CONFIG: "Err - DELETE_CONFIG {triggerId}{message}",
                READ_CONFIG: "Err - READ_CONFIG {timeFrames}{message}",
                INITIALIZE_CHAT: "Err - INITIALIZE_CHAT{message}",
                EVENTS: "Err - EVENTS {events}{message}",
            },
        },
    };
});
describe("CommunicationPresenter", () => {
    const mockCommunicationOut = {
        send: jest.fn(),
    };
    beforeEach(() => {
        mockCommunicationOut.send.mockClear();
    });

    describe("send", () => {
        describe("READ_CONFIG", () => {
            it("should send the triggers", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers = { trigger: { mock: "trigger" }, trigger2: { mock: "trigger2" } };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    timeFrames: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `Succ - READ_CONFIG ${JSON.stringify(mockTriggers, null, "  ")}`,
                );
            });
        });

        describe("DELETE_CONFIG", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - DELETE_CONFIG someTrigger");
            });
            it("should add the additional message for succes", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Succ - DELETE_CONFIG someTrigger Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - DELETE_CONFIG someTrigger");
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Err - DELETE_CONFIG someTrigger Details",
                );
            });
        });
        describe("SET_CONFIG", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - SET_CONFIG someTrigger");
            });
            it("should add the additional message for success", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Succ - SET_CONFIG someTrigger Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - SET_CONFIG someTrigger");
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Err - SET_CONFIG someTrigger Details",
                );
            });
        });
        describe("INITIALIZE_CHAT", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - INITIALIZE_CHAT");
            });
            it("should add the additional message for success", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - INITIALIZE_CHAT Details");
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                    hasError: true,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - INITIALIZE_CHAT");
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                    hasError: true,
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - INITIALIZE_CHAT Details");
            });
        });
        describe("EVENTS", () => {
            it("should send the events", () => {
                const presenter = new CommunicationPresenter();
                const events = [
                    {
                        start: new Date(2020, 4, 1, 12, 0),
                        end: new Date(2020, 4, 1, 12, 0),
                        title: "Event",
                    },
                ];
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.EVENTS,
                    events,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `Succ - EVENTS ${JSON.stringify(events, null, "  ")}`,
                );
            });
        });
        describe("ADD_ADMIN", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    newAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - ADD_ADMIN admin");
            });
            it("should add the additional message for succes", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    newAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - ADD_ADMIN admin Details");
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    hasError: true,
                    newAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - ADD_ADMIN admin");
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    hasError: true,
                    newAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - ADD_ADMIN admin Details");
            });
        });
        describe("REMOVE_ADMIN", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    oldAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - REMOVE_ADMIN admin");
            });
            it("should add the additional message for succes", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    oldAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Succ - REMOVE_ADMIN admin Details");
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    hasError: true,
                    oldAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - REMOVE_ADMIN admin");
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter();
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    hasError: true,
                    oldAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Err - REMOVE_ADMIN admin Details");
            });
        });
    });
    describe("sendError", () => {
        it("should send error with 'Fehler:'", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendError("someChat", "reason");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Fehler: reason");
        });
    });
    describe("sendCommunicationError", () => {
        it("should replace all properties", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("GIVEN_EXPECTED_EXAMPLE" as any, "-given-", "-expected-", "-example-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Expected: -expected- Example: -example-",
            );
        });
        it("should replace only given and expected", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("NO_EXAMPLE" as any, "-given-", "-expected-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Expected: -expected-",
            );
        });
        it("should only replace the placeholders", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("NO_EXPECTED" as any, "-given-", "-expected-", "-example-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Example: -example-",
            );
        });
        it("should only replace all duplicated placeholders", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("DUPLICATE_GIVEN" as any, "-given-", "-expected-", "-example-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Expected: -expected- Given [-given-]",
            );
        });
    });
});
