import { DailyRecurrenceRule } from "../../../src/entities";
import { Chat } from "../../../src/entities/Chat";
import { EntityError, EntityErrorCode } from "../../../src/entities/EntityError";
import { TimeFrame, TimeFrameSettings } from "../../../src/entities/TimeFrame";

describe("Chat", () => {
    const baseRecurrence = new DailyRecurrenceRule(17, 42, {});
    const baseFrame = new TimeFrame({}, {});
    const baseSettings = { frame: baseFrame, recurrence: baseRecurrence };

    describe("Administrators", () => {
        it("should add all users given in the constructor", () => {
            const chat = new Chat(["admin1", "admin2", "admin3"]);
            const config = chat.getConfig();
            expect(config.administrators).toEqual(["admin1", "admin2", "admin3"]);
        });

        describe("addAdmin", () => {
            it("should add a new admin if current user is an admin", () => {
                const chat = new Chat(["admin1"]);
                chat.addAdmin("admin1", "admin2");
                const config = chat.getConfig();
                expect(config.administrators).toEqual(["admin1", "admin2"]);
            });
            it("should fail to add a new admin if current user is not an admin", () => {
                const chat = new Chat(["admin1"]);
                expect(() => {
                    chat.addAdmin("noAdmin", "admin2");
                }).toThrow(new EntityError(EntityErrorCode.MISSING_PRIVILEGES));
            });
        });

        describe("removeAdmin", () => {
            it("should remove a new admin if current user is an admin", () => {
                const chat = new Chat(["admin1", "admin2"]);
                chat.removeAdmin("admin1", "admin2");
                const config = chat.getConfig();
                expect(config.administrators).toEqual(["admin1"]);
            });
            it("should remove the admin itself", () => {
                const chat = new Chat(["admin1", "admin2"]);
                chat.removeAdmin("admin1", "admin1");
                const config = chat.getConfig();
                expect(config.administrators).toEqual(["admin2"]);
            });
            it("should fail to remove a new admin if current user is not an admin", () => {
                const chat = new Chat(["admin1", "admin2"]);
                expect(() => {
                    chat.removeAdmin("noAdmin", "admin2");
                }).toThrow(new EntityError(EntityErrorCode.MISSING_PRIVILEGES));
            });
            it("should fail to remove a new admin if to be removed user is not an admin", () => {
                const chat = new Chat(["admin1", "admin2"]);
                expect(() => {
                    chat.removeAdmin("admin1", "noAdmin");
                }).toThrow(new EntityError(EntityErrorCode.NO_ADMIN, { user: "noAdmin" }));
            });
            it("should fail to remove a new admin if to be removed user is the last admin", () => {
                const chat = new Chat(["admin1"]);
                expect(() => {
                    chat.removeAdmin("admin1", "admin1");
                }).toThrow(new EntityError(EntityErrorCode.LAST_ADMIN));
            });
        });
    });

    describe("TimeFrames", () => {
        it("should set and return the time frame", () => {
            const chat = new Chat(["admin"]);
            chat.setTimeFrame("tf", baseSettings, "admin");
            const tf = chat.getTimeFrame("tf");
            expect(tf).toBeDefined();
        });
        it("should fail if user has no privileges", () => {
            const chat = new Chat(["admin"]);
            expect(() => {
                chat.setTimeFrame("tf_not", baseSettings, "another user");
            }).toThrow(new EntityError(EntityErrorCode.MISSING_PRIVILEGES));
            const tf = chat.getTimeFrame("tf_not");
            expect(tf).not.toBeDefined();
        });
        it("should return undefined for not exisiting timeframes", () => {
            const chat = new Chat(["admin"]);
            chat.setTimeFrame("tf", baseSettings, "admin");
            const tf = chat.getTimeFrame("notDefined");
            expect(tf).not.toBeDefined();
        });
        it("should remove a time frame", () => {
            const chat = new Chat(["admin"]);
            chat.setTimeFrame("tf", baseSettings, "admin");
            chat.removeTimeFrame("tf", "admin");
            const tf = chat.getTimeFrame("tf");
            expect(tf).not.toBeDefined();
        });
        it("should not remove a time frame if user has no privileges", () => {
            const chat = new Chat(["admin"]);
            chat.setTimeFrame("tf", baseSettings, "admin");
            expect(() => {
                chat.removeTimeFrame("tf", "no admin");
            }).toThrow(new EntityError(EntityErrorCode.MISSING_PRIVILEGES));
            const tf = chat.getTimeFrame("tf");
            expect(tf).toBeDefined();
        });
        it("should create the correct TimeFrame", () => {
            const chat = new Chat(["admin"]);
            const tfBegin: TimeFrameSettings = {
                minute: { value: -1 },
                hour: { value: -1 },
                day: { value: -1 },
                month: { value: -1 },
                year: { value: -1 },
            };
            const tfEnd: TimeFrameSettings = {
                minute: { value: 2 },
                hour: { value: 2 },
                day: { value: 2 },
                month: { value: 2 },
                year: { value: 2 },
            };
            const tf2Begin: TimeFrameSettings = {
                minute: { value: 30 },
                hour: { value: 12 },
                day: { value: 2 },
                month: { value: 1 },
                year: { value: 2020 },
            };
            const tf2End: TimeFrameSettings = {
                minute: { value: 40 },
                hour: { value: 13 },
                day: { value: 3 },
                month: { value: 8 },
                year: { value: 2020 },
            };
            const tf = new TimeFrame(tfBegin, tfEnd);
            const tf2 = new TimeFrame(tf2Begin, tf2End);

            chat.setTimeFrame("tf", { frame: tf, recurrence: baseRecurrence }, "admin");
            chat.setTimeFrame("tf2", { frame: tf2, recurrence: baseRecurrence }, "admin");

            const actualTf = chat.getTimeFrame("tf");
            const actualTf2 = chat.getTimeFrame("tf2");
            const date = new Date(2020, 8, 13, 18, 45, 17, 30);
            expect(actualTf?.frame.getStart(date)).toEqual(tf.getStart(date));
            expect(actualTf?.frame.getEnd(date)).toEqual(tf.getEnd(date));
            expect(actualTf2?.frame.getStart(date)).toEqual(tf2.getStart(date));
            expect(actualTf2?.frame.getEnd(date)).toEqual(tf2.getEnd(date));
        });
        it("should use empty settings as defaults", () => {
            const chat = new Chat(["admin"]);
            const tf = new TimeFrame({}, {});

            chat.setTimeFrame("tf", { frame: tf, recurrence: baseRecurrence }, "admin");

            const actualTf = chat.getTimeFrame("tf");
            const date = new Date(2020, 8, 13, 18, 45, 17, 30);
            expect(actualTf?.frame.getStart(date)).toEqual(tf.getStart(date));
            expect(actualTf?.frame.getEnd(date)).toEqual(tf.getEnd(date));
        });
    });

    describe("getConfig", () => {
        it("should return the chat in JSON format", () => {
            const tfBegin: TimeFrameSettings = {
                minute: { value: 30 },
                hour: { value: 12 },
                day: { value: 2 },
                month: { value: 1 },
                year: { value: 2020 },
            };
            const tfEnd: TimeFrameSettings = {
                minute: { value: 40 },
                hour: { value: 13 },
                day: { value: 3 },
                month: { value: 8 },
                year: { value: 2020 },
            };
            const chat = new Chat(["admin"]);
            chat.setTimeFrame("tf", { frame: new TimeFrame(tfBegin, tfEnd), recurrence: baseRecurrence }, "admin");
            expect(chat.getConfig()).toEqual({
                administrators: ["admin"],
                settings: [
                    {
                        key: "tf",
                        frame: {
                            begin: {
                                minute: { value: 30 },
                                hour: { value: 12 },
                                day: { value: 2 },
                                month: { value: 1 },
                                year: { value: 2020 },
                            },
                            end: {
                                minute: { value: 40 },
                                hour: { value: 13 },
                                day: { value: 3 },
                                month: { value: 8 },
                                year: { value: 2020 },
                            },
                        },
                        recurrence: {
                            hour: 17,
                            minute: 42,
                            type: "d",
                            weekDays: {},
                        },
                    },
                ],
            });
        });
    });
});
