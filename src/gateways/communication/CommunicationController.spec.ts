import { CommunicationController } from "./CommunicationController";
import { RecurrenceType } from "../../interfaces";

describe("CommunicationController", () => {
    const updateMock = {
        execute: jest.fn(),
    };
    const controller = new CommunicationController({ update: updateMock });
    beforeEach(() => {
        updateMock.execute.mockReset();
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
            it("should work", () => {
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
                                fromMinute: 30,
                                toHour: 20,
                                toMinute: 15,
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
    });
});
