import { RecurrenceType } from "../../../../src/entities";
import { CommunicationController } from "../../../../src/gateways";
import { PersistedRecurrenceType } from "../../../../src/useCases";
import { MockUseCase } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

describe("CommunicationController", () => {
    const setMock = new MockUseCase();
    const initMock = new MockUseCase();
    const deleteMock = new MockUseCase();
    const readMock = new MockUseCase();
    const addAdminMock = new MockUseCase();
    const removeAdminMock = new MockUseCase();
    const mockLogger = new MockLogger();
    const errrorReporterMock = {
        sendCommunicationError: jest.fn(),
        sendError: jest.fn(),
    };
    const controller = new CommunicationController(mockLogger);
    controller.init({
        useCases: {
            config: {
                delete: deleteMock,
                read: readMock,
                set: setMock,
            },
            admin: {
                init: initMock,
                add: addAdminMock,
                remove: removeAdminMock,
            },
        },
        presenter: errrorReporterMock,
    });
    beforeEach(() => {
        setMock.execute.mockReset();
        errrorReporterMock.sendCommunicationError.mockReset();
        errrorReporterMock.sendError.mockReset();
    });
    describe("set", () => {
        it("should send the basic information", async () => {
            await controller.set("chat", "user", "trigger", {
                recurrence: {
                    type: RecurrenceType.daily,
                    daysOfWeek: {
                        monday: true,
                        tuesday: true,
                    },
                    hour: 17,
                    minute: 0,
                },
            });
            expect(setMock.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    chatId: "chat",
                    userId: "user",
                    triggerId: "trigger",
                }),
            );
        });

        describe("hourly", () => {
            it("should work", async () => {
                await controller.set("chat", "user", "trigger", {
                    recurrence: {
                        type: PersistedRecurrenceType.hourly,
                        daysOfWeek: {
                            monday: true,
                            tuesday: true,
                            wednesday: true,
                            thursday: true,
                            friday: true,
                            saturday: true,
                            sunday: true,
                        },
                        hour: 7,
                        hourEnd: 20,
                        minute: 30,
                    },
                });
                expect(setMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: PersistedRecurrenceType.hourly,
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
                            frame: {
                                begin: {},
                                end: {},
                            },
                        },
                    }),
                );
            });
        });

        describe("daily", () => {
            it("should work", async () => {
                await controller.set("chat", "user", "trigger", {
                    recurrence: {
                        type: PersistedRecurrenceType.daily,
                        daysOfWeek: {
                            monday: true,
                            tuesday: true,
                        },
                        hour: 17,
                        minute: 0,
                    },
                });
                expect(setMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: PersistedRecurrenceType.daily,
                                days: {
                                    monday: true,
                                    tuesday: true,
                                },
                                hour: 17,
                                minute: 0,
                            },
                            frame: {
                                begin: {},
                                end: {},
                            },
                        },
                    }),
                );
            });
        });

        describe("monthly", () => {
            it("should work", async () => {
                await controller.set("chat", "user", "trigger", {
                    recurrence: {
                        type: PersistedRecurrenceType.monthly,
                        dayOfMonth: 25,
                        hour: 14,
                        minute: 5,
                    },
                });
                expect(setMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: {
                            recurrence: {
                                type: PersistedRecurrenceType.monthly,
                                day: 25,
                                hour: 14,
                                minute: 5,
                            },
                            frame: {
                                begin: {},
                                end: {},
                            },
                        },
                    }),
                );
            });
        });

        describe("frames", () => {
            it("should work", async () => {
                await controller.set("chat", "user", "trigger", {
                    recurrence: {
                        type: PersistedRecurrenceType.monthly,
                        dayOfMonth: 25,
                        hour: 14,
                        minute: 5,
                    },
                    frame: {
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
                });
                expect(setMock.execute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: expect.objectContaining({
                            frame: {
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
                        }),
                    }),
                );
            });
        });

        describe("validation", () => {
            const testException = async (
                fn: () => Promise<void>,
                expected: {
                    key: string;
                    given?: string;
                    expected?: string;
                    example?: string;
                },
            ) => {
                await fn();
                expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(1);
                const error = errrorReporterMock.sendCommunicationError.mock.calls[0][1];
                expect(error.message).toEqual(expect.stringMatching(new RegExp(`^${expected.key}`)));
                expect(error.key).toEqual(expected.key);
                if (expected.given) {
                    expect(error.given).toEqual(expected.given);
                }
                if (expected.expected) {
                    expect(error.expected).toEqual(expected.expected);
                }
                if (expected.example) {
                    expect(error.example).toEqual(expected.example);
                }
            };

            it("invalid recurrence", async () => {
                await testException(
                    () =>
                        controller.set("chat", "user", "trigger", {
                            recurrence: {
                                type: "None" as any,
                                dayOfMonth: 25,
                                hour: 14,
                                minute: 5,
                            },
                        }),
                    {
                        key: "INVALID_RECURRENCE_TYPE",
                        given: "None",
                    },
                );
            });

            it("other error", async () => {
                await controller.set("chat", "user", "trigger", undefined as any);
                expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(0);
                expect(errrorReporterMock.sendError).toHaveBeenCalledTimes(1);
                const error = errrorReporterMock.sendError.mock.calls[0][1];
                expect(error).toEqual(expect.stringContaining("of undefined"));
            });

            describe("hourly", () => {
                it("missing days", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.hourly,
                                    hour: 7,
                                    hourEnd: 20,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_DAYS",
                            given: "Missing",
                            expected: "0-6",
                            example: "2",
                        },
                    );
                });
                it("empty days", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.hourly,
                                    daysOfWeek: {},
                                    hour: 7,
                                    hourEnd: 20,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_DAYS",
                            given: "None Set",
                            expected: "0-6",
                            example: "2",
                        },
                    );
                });
                it("invalid start time", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.hourly,
                                    daysOfWeek: {
                                        monday: true,
                                    },
                                    hour: 36,
                                    hourEnd: 20,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_TIME",
                            given: "36",
                            expected: "0-23",
                            example: "17",
                        },
                    );
                });
                it("invalid end time", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.hourly,
                                    daysOfWeek: {
                                        monday: true,
                                    },
                                    hour: 10,
                                    hourEnd: 24,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_TIME",
                            given: "24",
                            expected: "10-23",
                            example: "11",
                        },
                    );
                });
                it("invalid end time (lower than start)", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.hourly,
                                    daysOfWeek: {
                                        monday: true,
                                    },
                                    hour: 10,
                                    hourEnd: 8,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_TIME",
                            given: "8",
                            expected: "10-23",
                            example: "11",
                        },
                    );
                });
                it("invalid end time (lower than start - 23)", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.hourly,
                                    daysOfWeek: {
                                        monday: true,
                                    },
                                    hour: 23,
                                    hourEnd: 20,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_TIME",
                            given: "20",
                            expected: "23-23",
                            example: "23",
                        },
                    );
                });
            });

            describe("daily", () => {
                it("missing days", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.daily,
                                    hour: 7,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_DAYS",
                            given: "Missing",
                            expected: "0-6",
                            example: "2",
                        },
                    );
                });
                it("empty days", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.daily,
                                    daysOfWeek: {},
                                    hour: 7,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_DAYS",
                            given: "None Set",
                            expected: "0-6",
                            example: "2",
                        },
                    );
                });
                it("invalid time", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.daily,
                                    daysOfWeek: {
                                        monday: true,
                                    },
                                    hour: 36,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_TIME",
                            given: "36",
                            expected: "0-23",
                            example: "17",
                        },
                    );
                });
            });

            describe("monthly", () => {
                it("invalid day", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.monthly,
                                    dayOfMonth: 42,
                                    hour: 36,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_DAY_OF_MONTH",
                            given: "42",
                            expected: "1-31",
                            example: "17",
                        },
                    );
                });
                it("invalid time", async () => {
                    await testException(
                        () =>
                            controller.set("chat", "user", "trigger", {
                                recurrence: {
                                    type: PersistedRecurrenceType.daily,
                                    dayOfMonth: 10,
                                    hour: 36,
                                    minute: 30,
                                },
                            }),
                        {
                            key: "INVALID_TIME",
                            given: "36",
                            expected: "0-23",
                            example: "17",
                        },
                    );
                });
            });

            describe("frames", () => {
                describe("start", () => {
                    it("no value for year", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {
                                            year: {},
                                        },
                                        end: {},
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for year missing",
                            },
                        );
                    });
                    it("no value for month", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {
                                            month: {},
                                        },
                                        end: {},
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for month missing",
                            },
                        );
                    });
                    it("no value for day", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {
                                            day: {},
                                        },
                                        end: {},
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for day missing",
                            },
                        );
                    });
                    it("no value for hour", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {
                                            hour: {},
                                        },
                                        end: {},
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for hour missing",
                            },
                        );
                    });
                    it("no value for minute", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {
                                            minute: {},
                                        },
                                        end: {},
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for minute missing",
                            },
                        );
                    });
                });
                describe("end", () => {
                    it("no value for year", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {},
                                        end: {
                                            year: {},
                                        },
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for year missing",
                            },
                        );
                    });
                    it("no value for month", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {},
                                        end: {
                                            month: {},
                                        },
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for month missing",
                            },
                        );
                    });
                    it("no value for day", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {},
                                        end: {
                                            day: {},
                                        },
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for day missing",
                            },
                        );
                    });
                    it("no value for hour", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {},
                                        end: {
                                            hour: {},
                                        },
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for hour missing",
                            },
                        );
                    });
                    it("no value for minute", async () => {
                        await testException(
                            () =>
                                controller.set("chat", "user", "trigger", {
                                    recurrence: {
                                        type: PersistedRecurrenceType.monthly,
                                        dayOfMonth: 25,
                                        hour: 14,
                                        minute: 5,
                                    },
                                    frame: {
                                        begin: {},
                                        end: {
                                            minute: {},
                                        },
                                    },
                                }),
                            {
                                key: "INVALID_FRAME_CONFIG",
                                given: "Value for minute missing",
                            },
                        );
                    });
                });
            });
        });
    });
    describe("initChat", () => {
        it("should pass the data to the use case", async () => {
            await controller.initChat("chatId", "userId");
            expect(initMock.execute).toHaveBeenCalledWith({ chatId: "chatId", userId: "userId" });
        });
        it("should send an error if the init fails", async () => {
            initMock.execute.mockImplementation(() => {
                throw new Error("Failed");
            });
            await controller.initChat("chatId", "userId");
            expect(errrorReporterMock.sendError).toHaveBeenCalledWith("chatId", "Error: Failed");
        });
    });
    describe("delete", () => {
        it("should pass the data to the use case", async () => {
            await controller.delete("chat", "user", "trigger");
            expect(deleteMock.execute).toHaveBeenCalledWith({
                chatId: "chat",
                userId: "user",
                triggerId: "trigger",
            });
        });

        it("should handle missing triggers", async () => {
            await controller.delete("chat", "user", "");
            expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(1);
            const error = errrorReporterMock.sendCommunicationError.mock.calls[0][1];
            expect(error.message).toEqual(expect.stringMatching(new RegExp(`^${"MISSING_TRIGGER_ID"}`)));
            expect(error.key).toEqual("MISSING_TRIGGER_ID");
        });

        it("should handle generic errors", async () => {
            await controller.delete("chat", "user", undefined as any);
            expect(errrorReporterMock.sendCommunicationError).toHaveBeenCalledTimes(0);
            expect(errrorReporterMock.sendError).toHaveBeenCalledTimes(1);
            const error = errrorReporterMock.sendError.mock.calls[0][1];
            expect(error).toEqual(expect.stringContaining("of undefined"));
        });
    });
    describe("read", () => {
        it("should pass the data to the use case", async () => {
            await controller.read("chat");
            expect(readMock.execute).toHaveBeenCalledWith({ chatId: "chat" });
        });
    });
    describe("addAdmin", () => {
        it("should pass the data to the use case", async () => {
            await controller.addAdmin("chat", "user", " newAdmin ");
            expect(addAdminMock.execute).toHaveBeenCalledWith({ chatId: "chat", userId: "user", adminId: "newAdmin" });
        });
    });
    describe("removeadmin", () => {
        it("should pass the data to the use case", async () => {
            await controller.removeAdmin("chat", "user", " newAdmin ");
            expect(removeAdminMock.execute).toHaveBeenCalledWith({
                chatId: "chat",
                userId: "user",
                adminId: "newAdmin",
            });
        });
    });
});
