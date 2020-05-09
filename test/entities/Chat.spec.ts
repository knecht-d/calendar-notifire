import { Chat } from "../../src/entities/Chat";
import { TimeFrame } from "../../src/entities/TimeFrame";
import { IRecurrenceRule, RecurrenceType, ITimeFrameSettings } from "../../src/interfaces";
import { EntityErrorCode, EntityError } from "../../src/entities/EntityError";

describe("Chat", () => {
    const baseRecurrence: IRecurrenceRule = {
        type: RecurrenceType.daily,
        days: {},
        hour: 17,
        minute: 42,
    };

    describe("TimeFrames", () => {
        it("should set and return the time frame", () => {
            const chat = new Chat("admin");
            chat.setTimeFrame("tf", { recurrence: baseRecurrence }, "admin");
            const tf = chat.getTimeFrame("tf");
            expect(tf).toBeDefined();
        });
        it("should sfail if user has now privileges", () => {
            const chat = new Chat("admin");
            expect(() => {
                chat.setTimeFrame("tf_not", { recurrence: baseRecurrence }, "another user");
            }).toThrow(new EntityError(EntityErrorCode.MISSING_PRIVILEGES));
            const tf = chat.getTimeFrame("tf_not");
            expect(tf).not.toBeDefined();
        });
        it("should return undefined for not exisiting timeframes", () => {
            const chat = new Chat("admin");
            chat.setTimeFrame("tf", { recurrence: baseRecurrence }, "admin");
            const tf = chat.getTimeFrame("notDefined");
            expect(tf).not.toBeDefined();
        });
        it("should create the correct TimeFrame", () => {
            const chat = new Chat("admin");
            const tfBegin: ITimeFrameSettings = {
                minute: { value: -1 },
                hour: { value: -1 },
                day: { value: -1 },
                month: { value: -1 },
                year: { value: -1 },
            };
            const tfEnd: ITimeFrameSettings = {
                minute: { value: 2 },
                hour: { value: 2 },
                day: { value: 2 },
                month: { value: 2 },
                year: { value: 2 },
            };
            const tf2Begin: ITimeFrameSettings = {
                minute: { value: 30 },
                hour: { value: 12 },
                day: { value: 2 },
                month: { value: 1 },
                year: { value: 2020 },
            };
            const tf2End: ITimeFrameSettings = {
                minute: { value: 40 },
                hour: { value: 13 },
                day: { value: 3 },
                month: { value: 8 },
                year: { value: 2020 },
            };
            const tf = new TimeFrame(tfBegin, tfEnd, baseRecurrence);
            const tf2 = new TimeFrame(tf2Begin, tf2End, baseRecurrence);

            chat.setTimeFrame("tf", { begin: tfBegin, end: tfEnd, recurrence: baseRecurrence }, "admin");
            chat.setTimeFrame("tf2", { begin: tf2Begin, end: tf2End, recurrence: baseRecurrence }, "admin");

            const actualTf = chat.getTimeFrame("tf");
            const actualTf2 = chat.getTimeFrame("tf2");
            const date = new Date(2020, 8, 13, 18, 45, 17, 30);
            expect(actualTf?.getStart(date)).toEqual(tf.getStart(date));
            expect(actualTf?.getEnd(date)).toEqual(tf.getEnd(date));
            expect(actualTf2?.getStart(date)).toEqual(tf2.getStart(date));
            expect(actualTf2?.getEnd(date)).toEqual(tf2.getEnd(date));
        });
        it("should use empty settings as defaults", () => {
            const chat = new Chat("admin");
            const tf = new TimeFrame({}, {}, baseRecurrence);

            chat.setTimeFrame("tf", { recurrence: baseRecurrence }, "admin");

            const actualTf = chat.getTimeFrame("tf");
            const date = new Date(2020, 8, 13, 18, 45, 17, 30);
            expect(actualTf?.getStart(date)).toEqual(tf.getStart(date));
            expect(actualTf?.getEnd(date)).toEqual(tf.getEnd(date));
        });
    });

    describe("serialize", () => {
        it("should return the chat in JSON format", () => {
            const tfBegin: ITimeFrameSettings = {
                minute: { value: 30 },
                hour: { value: 12 },
                day: { value: 2 },
                month: { value: 1 },
                year: { value: 2020 },
            };
            const tfEnd: ITimeFrameSettings = {
                minute: { value: 40 },
                hour: { value: 13 },
                day: { value: 3 },
                month: { value: 8 },
                year: { value: 2020 },
            };
            const chat = new Chat("admin");
            chat.setTimeFrame("tf", { begin: tfBegin, end: tfEnd, recurrence: baseRecurrence }, "admin");
            expect(chat.toJSON()).toEqual({
                administrators: ["admin"],
                timeFrames: {
                    tf: {
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
                        recurrence: { type: "d", days: {}, hour: 17, minute: 42 },
                    },
                },
            });
        });
    });
});