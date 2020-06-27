// import { Mappings } from "./Mappings";

import { CommunicationPresenter } from "../../../../src/gateways";
import { CommunicationError, CommunicationErrorCode } from "../../../../src/gateways/communication/CommunicationError";
import { IDaysOfWeekConfig, ITriggers, MessageKey, PersistedRecurrenceType } from "../../../../src/useCases";
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

            it("should not send the end date if it is on same day", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.hourly,
                            fromHour: 14,
                            toHour: 20,
                            days: { monday: true },
                            minute: 0,
                        },
                        next: new Date(2020, 5, 25, 15, 0),
                        nextEventsFrom: new Date(2020, 5, 25, 15, 0),
                        nextEventsTo: new Date(2020, 5, 25, 16, 0),
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Stündlich von 14:00 bis 20:00 am Montag
    Nächte Erinnerung am 25.6.2020 um 15:00 zeigt Termine von 25.6.2020 15:00 bis 16:00`,
                );
            });

            it("should not send the next events if nextEventsFrom is not given", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.hourly,
                            fromHour: 14,
                            toHour: 20,
                            days: { monday: true },
                            minute: 0,
                        },
                        next: new Date(2020, 5, 25, 15, 0),
                        nextEventsTo: new Date(2020, 5, 25, 16, 0),
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Stündlich von 14:00 bis 20:00 am Montag
    Nächte Erinnerung am 25.6.2020 um 15:00`,
                );
            });
            it("should not send the next events if nextEventsTo is not given", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.hourly,
                            fromHour: 14,
                            toHour: 20,
                            days: { monday: true },
                            minute: 0,
                        },
                        next: new Date(2020, 5, 25, 15, 0),
                        nextEventsFrom: new Date(2020, 5, 25, 15, 0),
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Stündlich von 14:00 bis 20:00 am Montag
    Nächte Erinnerung am 25.6.2020 um 15:00`,
                );
            });
            it("should send the text for weekdays", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.daily,
                            hour: 17,
                            days: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
                            minute: 0,
                        },
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Einmal täglich um 17:00 an allen Wochentagen`,
                );
            });
            it("should send the text for weekends", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.daily,
                            hour: 17,
                            days: { saturday: true, sunday: true },
                            minute: 0,
                        },
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Einmal täglich um 17:00 am Wochenende`,
                );
            });
            it("should send the text for all days", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.daily,
                            hour: 17,
                            days: {
                                monday: true,
                                tuesday: true,
                                wednesday: true,
                                thursday: true,
                                friday: true,
                                saturday: true,
                                sunday: true,
                            },
                            minute: 0,
                        },
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Einmal täglich um 17:00 an allen Tagen`,
                );
            });

            const dayCombinations: Array<[string, IDaysOfWeekConfig]> = [
                [
                    "Montag, Dienstag, Mittwoch, Donnerstag, Freitag und Samstag",
                    {
                        monday: true,
                        tuesday: true,
                        wednesday: true,
                        thursday: true,
                        friday: true,
                        saturday: true,
                    },
                ],
                [
                    "Dienstag, Donnerstag und Sonntag",
                    {
                        tuesday: true,
                        thursday: true,
                        sunday: true,
                    },
                ],
                [
                    "Montag und Sonntag",
                    {
                        monday: true,
                        sunday: true,
                    },
                ],
                [
                    "Dienstag",
                    {
                        tuesday: true,
                    },
                ],
            ];

            it.each(dayCombinations)("should send the text for %s", (text, days) => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                const mockTriggers: ITriggers = {
                    trigger: {
                        recurrence: {
                            type: PersistedRecurrenceType.daily,
                            hour: 17,
                            days,
                            minute: 0,
                        },
                        begin: {},
                        end: {
                            hour: {
                                value: 1,
                                fixed: false,
                            },
                        },
                    },
                };
                presenter.send("someChat", {
                    key: MessageKey.READ_CONFIG,
                    triggers: mockTriggers as any,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `trigger:
    Einmal täglich um 17:00 am ${text}`,
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
                    "Löschen von someTrigger erfolgreich.\nDetails",
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
                    "Löschen von someTrigger fehlgeschlagen.\nDetails",
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
                    "Setzen von someTrigger erfolgreich.\nDetails",
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
                    "Setzen von someTrigger fehlgeschlagen.\nDetails",
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
                    "Initialisierung des Chats erfolgreich.\nDetails",
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
                    "Initialisierung des Chats fehlgeschlagen.\nDetails",
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
            it("should send the events with different end date", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                const events = [
                    {
                        start: new Date(2020, 4, 1, 12, 0),
                        end: new Date(2020, 4, 2, 12, 0),
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
    1.5.2020 12:00 - 2.5.2020 12:00`,
                );
            });
            it("should add the additional message for success", () => {
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
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    `Termine:
Event:
    1.5.2020 12:00 - 12:00
Details`,
                );
            });
            it("should send a plain error message to the chat", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.EVENTS,
                    events: [],
                    hasError: true,
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Lesen der Termine fehlgeschlagen.");
            });
            it("should add the additional message for error", () => {
                const presenter = new CommunicationPresenter(mockLogger);
                presenter.init({ communication: mockCommunicationOut });
                presenter.send("someChat", {
                    key: MessageKey.EVENTS,
                    events: [],
                    hasError: true,
                    message: "Details",
                });
                expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                    "someChat",
                    "Lesen der Termine fehlgeschlagen.\nDetails",
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
                    "admin erfolgreich zu Administratoren hinzugefügt.\nDetails",
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
                    "Hinzufügen von admin zu Administratoren fehlgeschlagen.\nDetails",
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
                    "admin erfolgreich von Administratoren entfernt.\nDetails",
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
                    "Entfernen von admin aus Administratoren fehlgeschlagen.\nDetails",
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
