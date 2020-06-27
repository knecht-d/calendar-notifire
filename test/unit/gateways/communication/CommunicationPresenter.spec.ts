// import { Mappings } from "./Mappings";

import { CommunicationPresenter } from "../../../../src/gateways";
import { CommunicationError, CommunicationErrorCode } from "../../../../src/gateways/communication/CommunicationError";
import { ITriggers, MessageKey, PersistedRecurrenceType } from "../../../../src/useCases";
import { MockLogger } from "../../../mocks/external/MockLogger";

describe("CommunicationPresenter", () => {
    const mockCommunicationOut = {
        send: jest.fn(),
    };
    const mockLogger = new MockLogger();
    beforeEach(() => {
        mockCommunicationOut.send.mockClear();
    });

    describe("send", () => {
        describe("READ_CONFIG", () => {
            it("should send the triggers", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.monthly,
                            day: 25,
                            hour: 14,
                            minute: 5,
                        },
                        next: new Date(2020, 5, 25, 14, 5),
                        nextEventsFrom: new Date(2020, 5, 25, 14, 5),
                        nextEventsTo: new Date(2020, 7, 0, 0, 0),
                        begin: {},
                        end: {
                            month: {
                                value: 2,
                                fixed: false,
                            },
                            day: {
                                value: 0,
                                fixed: true,
                            },
                            hour: {
                                value: 0,
                                fixed: true,
                            },
                            minute: {
                                value: 0,
                                fixed: true,
                            },
                        },
                    },
                    trigger2: {
                        recurrence: {
                            type: PersistedRecurrenceType.daily,
                            hour: 14,
                            minute: 5,
                            days: {
                                saturday: true,
                                sunday: true,
                            },
                        },
                        begin: {
                            month: {
                                value: 1,
                                fixed: false,
                            },
                            day: {
                                value: 0,
                                fixed: true,
                            },
                            hour: {
                                value: 0,
                                fixed: true,
                            },
                            minute: {
                                value: 0,
                                fixed: true,
                            },
                        },
                        end: {},
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Jeden Monat am 25. um 14:05
    Nächte Erinnerung am 25.6.2020 um 14:05 zeigt Termine von 25.6.2020 14:05 bis 31.7.2020 00:00

trigger2:
    Einmal täglich um 14:05 am Wochenende`,
                );
            });
        });

        describe("DELETE_CONFIG", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Löschen von someTrigger erfolgreich.",
                );
            });
            it("should add the additional message for succes", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Löschen von someTrigger erfolgreich. Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Löschen von someTrigger fehlgeschlagen.",
                );
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.DELETE_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Löschen von someTrigger fehlgeschlagen. Details",
                );
            });
        });
        describe("SET_CONFIG", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Setzen von someTrigger erfolgreich.",
                );
            });
            it("should add the additional message for success", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Setzen von someTrigger erfolgreich. Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Setzen von someTrigger fehlgeschlagen.",
                );
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.SET_CONFIG,
                    hasError: true,
                    triggerId: "someTrigger",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Setzen von someTrigger fehlgeschlagen. Details",
                );
            });
        });
        describe("INITIALIZE_CHAT", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Initialisierung des Chats erfolgreich.",
                );
            });
            it("should add the additional message for success", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Initialisierung des Chats erfolgreich. Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                    hasError: true,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Initialisierung des Chats fehlgeschlagen.",
                );
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.INITIALIZE_CHAT,
                    hasError: true,
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Initialisierung des Chats fehlgeschlagen. Details",
                );
            });
        });
        describe("EVENTS", () => {
            it("should send the events", () => {
                const presenter = new CommunicationPresenter(mockLogger);
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
                    `Termine:
Event:
    1.5.2020 12:00 - 12:00`,
                );
            });
        });
        describe("ADD_ADMIN", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    newAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "admin erfolgreich zu Administratoren hinzugefügt.",
                );
            });
            it("should add the additional message for succes", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    newAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "admin erfolgreich zu Administratoren hinzugefügt. Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    hasError: true,
                    newAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Hinzufügen von admin zu Administratoren fehlgeschlagen.",
                );
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.ADD_ADMIN,
                    hasError: true,
                    newAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Hinzufügen von admin zu Administratoren fehlgeschlagen. Details",
                );
            });
        });
        describe("REMOVE_ADMIN", () => {
            it("should send a plain success message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    oldAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "admin erfolgreich von Administratoren entfernt.",
                );
            });
            it("should add the additional message for succes", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    oldAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "admin erfolgreich von Administratoren entfernt. Details",
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    hasError: true,
                    oldAdmin: "admin",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Entfernen von admin aus Administratoren fehlgeschlagen.",
                );
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.REMOVE_ADMIN,
                    hasError: true,
                    oldAdmin: "admin",
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Entfernen von admin aus Administratoren fehlgeschlagen. Details",
                );
            });
        });
    });
    describe("sendError", () => {
        it("should send error with 'Fehler:'", () => {
            const presenter = new CommunicationPresenter(mockLogger);
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendError("someChat", "reason");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Fehler: reason");
        });
    });
    describe("sendCommunicationError", () => {
        const error = {
            given: "given",
            expected: "expected",
            example: "example",
        };
        const cases = [
            [CommunicationErrorCode.MISSING_TRIGGER_ID, "Trigger ID Fehlt"],
            [
                CommunicationErrorCode.INVALID_RECURRENCE_TYPE,
                `Falscher Typ für Wiederholungen [${error.given}]. Mögliche Werte: ${error.expected}`,
            ],
            [
                CommunicationErrorCode.INVALID_NUMBER_OF_ARGUMENTS,
                `Falsche Anzahl an Argumenten [${error.given}]. Beispiel: {example}`,
            ],
            [
                CommunicationErrorCode.INVALID_DAYS,
                `Falsche Eingabe für Wochentage [${error.given}]. Mögliche Werte: ${error.expected}`,
            ],
            [
                CommunicationErrorCode.INVALID_DAY_OF_MONTH,
                `Falsche Eingabe für Tag des Monats [${error.given}]. Mögliche Werte: ${error.expected}`,
            ],
            [
                CommunicationErrorCode.INVALID_TIME,
                `Falsche Zeitangabe [${error.given}]. Mögliche Werte: ${error.expected}`,
            ],
            [
                CommunicationErrorCode.INVALID_FRAME_CONFIG,
                `Falsche Eingabe für den Betrachtungszeitraum [${error.given}]. Beispiel: ${error.example}`,
            ],
        ];
        it.each(cases)("%s should result in %s", (code, message) => {
            const presenter = new CommunicationPresenter(mockLogger);
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError(code as CommunicationErrorCode, error.given, error.expected, error.example),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", `Fehler: ${message}`);
        });
    });
});
