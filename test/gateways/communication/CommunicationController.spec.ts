import { CommunicationController } from "../../../src/gateways";
import { RecurrenceType } from "../../../src/interfaces";

describe("CommunicationController", () => {
    const updateMock = {
        execute: jest.fn(),
    };
    const initMock = {
        execute: jest.fn(),
    };
    const deleteMock = {
        execute: jest.fn(),
    };
    const readMock = {
        execute: jest.fn(),
    };
    const errrorReporterMock = {
        sendCommunicationError: jest.fn(),
        sendError: jest.fn(),
    };
    const controller = new CommunicationController();
    controller.init({
        useCases: { update: updateMock, init: initMock, delete: deleteMock, read: readMock },
        presenter: errrorReporterMock,
    });
    beforeEach(() => {
        updateMock.execute.mockReset();
        errrorReporterMock.sendCommunicationError.mockReset();
        errrorReporterMock.sendError.mockReset();
    });
    describe("update", () => {
        it("should send the basic information", () => {
            controller.update("chat", "user", "trigger t mo,di 17:00 t+1,s0,m0 t+2,s0,m0");
            expect(updateMock.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    chatId: "chat",
                    userId: "user",
                    triggerId: "trigger",
                }),
            );
        });

        describe("hourly", () => {
            it("should reduce the end hours, the minutes are less then the minutes of start", () => {
                controller.update("chat", "user", "trigger s mo,di,mi,do,fr,sa,so 07:30 20:15 - s+1,m0");
                expect(updateMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: RecurrenceType.hourly,
                                days: {
                                    monday: true,
                                    tuesday: true,
                                    wednesday: true,
                                    thursday: true,
                                    friday: true,
                                    saturday: true,
                                    sunday: true,
                                },
                                fromHour: 7,
                                toHour: 19,
                                minute: 30,
                            },
                            frameStart: {},
                            frameEnd: {
                                hour: {
                                    value: 1,
                                    fixed: false,
                                },
                                minute: {
                                    value: 0,
                                    fixed: true,
                                },
                            },
                        },
                    }),
                );
            });
            it("should keep the end hours, the minutes are more then the minutes of start", () => {
                controller.update("chat", "user", "trigger s mo,di,mi,do,fr,sa,so 07:30 20:45 - s+1,m0");
                expect(updateMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: RecurrenceType.hourly,
                                days: {
                                    monday: true,
                                    tuesday: true,
                                    wednesday: true,
                                    thursday: true,
                                    friday: true,
                                    saturday: true,
                                    sunday: true,
                                },
                                fromHour: 7,
                                toHour: 20,
                                minute: 30,
                            },
                            frameStart: {},
                            frameEnd: {
                                hour: {
                                    value: 1,
                                    fixed: false,
                                },
                                minute: {
                                    value: 0,
                                    fixed: true,
                                },
                            },
                        },
                    }),
                );
            });
            it("should keep the end hours, the minutes are eqial to the minutes of start", () => {
                controller.update("chat", "user", "trigger s mo,di,mi,do,fr,sa,so 07:30 20:30 - s+1,m0");
                expect(updateMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: RecurrenceType.hourly,
                                days: {
                                    monday: true,
                                    tuesday: true,
                                    wednesday: true,
                                    thursday: true,
                                    friday: true,
                                    saturday: true,
                                    sunday: true,
                                },
                                fromHour: 7,
                                toHour: 20,
                                minute: 30,
                            },
                            frameStart: {},
                            frameEnd: {
                                hour: {
                                    value: 1,
                                    fixed: false,
                                },
                                minute: {
                                    value: 0,
                                    fixed: true,
                                },
                            },
                        },
                    }),
                );
            });
        });

        describe("daily", () => {
            it("should work", () => {
                controller.update("chat", "user", "trigger t mo,di 17:00 t+1,s0,m0 t+2,s0,m0");
                expect(updateMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: RecurrenceType.daily,
                                days: {
                                    monday: true,
                                    tuesday: true,
                                    wednesday: false,
                                    thursday: false,
                                    friday: false,
                                    saturday: false,
                                    sunday: false,
                                },
                                hour: 17,
                                minute: 0,
                            },
                            frameStart: {
                                day: {
                                    value: 1,
                                    fixed: false,
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
                            frameEnd: {
                                day: {
                                    value: 2,
                                    fixed: false,
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
                    }),
                );
            });
        });

        describe("monthly", () => {
            it("should work", () => {
                controller.update("chat", "user", "trigger m 25 14:05 M+1,t0,s0,m0 M+2,t0,s0,m0");
                expect(updateMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: RecurrenceType.monthly,
                                day: 25,
                                hour: 14,
                                minute: 5,
                            },
                            frameStart: {
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
                            frameEnd: {
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
                    }),
                );
            });
        });

        describe("validation", () => {
            const testException = (
                fn: () => void,
                expected: {
                    key: string;
                    given?: string;
                    expected?: string;
                    example?: string;
                },
            ) => {
                fn();
                expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(1);
                const error = errrorReporterMock.sendCommunicationError.mock.calls[0][1];
                expect(error.message).toEqual(expect.stringMatching(new RegExp(`^${expected.key}`)));
                expect(error.key).toEqual(expected.key);
                expect(error.given).toEqual(expected.given);
                expect(error.expected).toEqual(expected.expected);
                expect(error.example).toEqual(expected.example);
            };

            it("invalid recurrence", () => {
                testException(
                    () => {
                        controller.update("chat", "user", "trigger d mo,di 17:00 t+1,s0,m0 t+2,s0,m0");
                    },
                    {
                        key: "INVALID_RECURRENCE_TYPE",
                        given: "d",
                        expected: "m,t,s",
                    },
                );
            });

            it("other error", () => {
                controller.update("chat", "user", undefined as any);
                expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(0);
                expect(errrorReporterMock.sendError).toHaveBeenCalledTimes(1);
                const error = errrorReporterMock.sendError.mock.calls[0][1];
                expect(error).toEqual(expect.stringContaining("of undefined"));
            });

            describe("hourly", () => {
                it("mising argument", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger s mo,di 07:00 t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_NUMBER_OF_ARGUMENTS",
                            given: "4",
                            expected: "5 (s [days] [start time] [end time] [start] [end])",
                            example: "s mo,di,so 07:30 19:30 t+1,s0,m0 t+2,s0,m0",
                        },
                    );
                });
                it("invalid days", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger s mo,di, 07:00 17:00 t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_DAYS",
                            given: "mo,di,",
                            expected: "mo|di|mi|do|fr|sa|so",
                            example: "mo,di,so",
                        },
                    );
                });
                it("invalid start time", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger s mo,di 07:60 19:00 t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_TIME",
                            given: "07:60",
                            expected: "0:0 - 23:59",
                            example: "17:23",
                        },
                    );
                });
                it("invalid end time", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger s mo,di 07:00 24:00 t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_TIME",
                            given: "24:00",
                            expected: "0:0 - 23:59",
                            example: "17:23",
                        },
                    );
                });
                it("invalid start frame", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger s mo,di 07:00 20:00 t*1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_FRAME_CONFIG",
                            given: "t*1,s0,m0",
                            expected: "[j|M|t|s|m](+|-)0-9 -",
                            example: "t+1,s0,m0",
                        },
                    );
                });
                it("invalid end frame", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger s mo,di 07:00 20:00 t+1,s0,m0 *");
                        },
                        {
                            key: "INVALID_FRAME_CONFIG",
                            given: "*",
                            expected: "[j|M|t|s|m](+|-)0-9 -",
                            example: "t+1,s0,m0",
                        },
                    );
                });
            });

            describe("daily", () => {
                it("mising argument", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger t mo,di t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_NUMBER_OF_ARGUMENTS",
                            given: "3",
                            expected: "4 (t [days] [time] [start] [end])",
                            example: "t mo,di,so 17:30 t+1,s0,m0 t+2,s0,m0",
                        },
                    );
                });
                it("invalid days", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger t mo,di, 17:00 t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_DAYS",
                            given: "mo,di,",
                            expected: "mo|di|mi|do|fr|sa|so",
                            example: "mo,di,so",
                        },
                    );
                });
                it("invalid time", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger t mo,di 24:00 t+1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_TIME",
                            given: "24:00",
                            expected: "0:0 - 23:59",
                            example: "17:23",
                        },
                    );
                });
                it("invalid start frame", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger t mo,di 17:00 t*1,s0,m0 t+2,s0,m0");
                        },
                        {
                            key: "INVALID_FRAME_CONFIG",
                            given: "t*1,s0,m0",
                            expected: "[j|M|t|s|m](+|-)0-9 -",
                            example: "t+1,s0,m0",
                        },
                    );
                });
                it("invalid end frame", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger t mo,di 17:00 t+1,s0,m0 *");
                        },
                        {
                            key: "INVALID_FRAME_CONFIG",
                            given: "*",
                            expected: "[j|M|t|s|m](+|-)0-9 -",
                            example: "t+1,s0,m0",
                        },
                    );
                });
            });

            describe("monthly", () => {
                it("mising argument", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger m 17:00 M+1,t1,s0,m0 M+2,t1,s0,m0");
                        },
                        {
                            key: "INVALID_NUMBER_OF_ARGUMENTS",
                            given: "3",
                            expected: "4 (m [day of month] [time] [start] [end])",
                            example: "m 15 17:30 M+1,t1,s0,m0 M+2,t1,s0,m0",
                        },
                    );
                });
                it("invalid day", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger m 40 17:00 M+1,t1,s0,m0 M+2,t1,s0,m0");
                        },
                        {
                            key: "INVALID_DAY_OF_MONTH",
                            given: "40",
                            expected: "1-31",
                            example: "13",
                        },
                    );
                });
                it("invalid time", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger m 15 17:60 M+1,t1,s0,m0 M+2,t1,s0,m0");
                        },
                        {
                            key: "INVALID_TIME",
                            given: "17:60",
                            expected: "0:0 - 23:59",
                            example: "17:23",
                        },
                    );
                });
                it("invalid start frame", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger m 15 17:00 M+1,T1,s0,m0 M+2,t1,s0,m0");
                        },
                        {
                            key: "INVALID_FRAME_CONFIG",
                            given: "M+1,T1,s0,m0",
                            expected: "[j|M|t|s|m](+|-)0-9 -",
                            example: "t+1,s0,m0",
                        },
                    );
                });
                it("invalid end frame", () => {
                    testException(
                        () => {
                            controller.update("chat", "user", "trigger m 15 17:00 M+1,t1,s0,m0 M+2,t/1,s0,m0");
                        },
                        {
                            key: "INVALID_FRAME_CONFIG",
                            given: "M+2,t/1,s0,m0",
                            expected: "[j|M|t|s|m](+|-)0-9 -",
                            example: "t+1,s0,m0",
                        },
                    );
                });
            });
        });
    });
    describe("initChat", () => {
        it("should pass the data to the use case", () => {
            controller.initChat("chatId", "userId");
            expect(initMock.execute).toHaveBeenCalledWith({ chatId: "chatId", userId: "userId" });
        });
        it("should send an error if the init fails", () => {
            initMock.execute.mockImplementation(() => {
                throw new Error("Failed");
            });
            controller.initChat("chatId", "userId");
            expect(errrorReporterMock.sendError).toHaveBeenCalledWith("chatId", "Error: Failed");
        });
    });
    describe("delete", () => {
        it("should pass the data to the use case", () => {
            controller.delete("chat", "user", "trigger");
            expect(deleteMock.execute).toHaveBeenCalledWith({
                chatId: "chat",
                userId: "user",
                triggerId: "trigger",
            });
        });

        it("should handle missing triggers", () => {
            controller.delete("chat", "user", "");
            expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(1);
            const error = errrorReporterMock.sendCommunicationError.mock.calls[0][1];
            expect(error.message).toEqual(expect.stringMatching(new RegExp(`^${"MISSING_TRIGGER_ID"}`)));
            expect(error.key).toEqual("MISSING_TRIGGER_ID");
        });

        it("should handle generic errors", () => {
            controller.delete("chat", "user", undefined as any);
            expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(0);
            expect(errrorReporterMock.sendError).toHaveBeenCalledTimes(1);
            const error = errrorReporterMock.sendError.mock.calls[0][1];
            expect(error).toEqual(expect.stringContaining("of undefined"));
        });
    });
    describe("read", () => {
        it("should pass the data to the use case", () => {
            controller.read("chat");
            expect(readMock.execute).toHaveBeenCalledWith({ chatId: "chat" });
        });
    });
});
