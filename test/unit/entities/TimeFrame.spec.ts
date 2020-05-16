import { TimeFrame } from "../../../src/entities";

describe("TimeFrame", () => {
    describe("getStart", () => {
        const baseDate = new Date(2020, 0, 1, 12, 20, 12, 42);
        it("should reset seconds and milliseconds but keep the rest for empty settings", () => {
            const tf = new TimeFrame({}, {});
            const start = tf.getStart(baseDate);
            expect(start).toEqual(new Date(2020, 0, 1, 12, 20));
        });
        describe("year", () => {
            it("should get the next year", () => {
                const tf = new TimeFrame({ year: { value: 1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2021, 0, 1, 12, 20));
            });
            it("should get the previous year", () => {
                const tf = new TimeFrame({ year: { value: -1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2019, 0, 1, 12, 20));
            });
            it("should set the year to 2010", () => {
                const tf = new TimeFrame({ year: { value: 2010, fixed: true } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2010, 0, 1, 12, 20));
            });
        });
        describe("month", () => {
            it("should get the next month", () => {
                const tf = new TimeFrame({ month: { value: 1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 1, 1, 12, 20));
            });
            it("should get the previous month", () => {
                const tf = new TimeFrame({ month: { value: -1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2019, 11, 1, 12, 20));
            });
            it("should set the month to January", () => {
                const tf = new TimeFrame({ month: { value: 1, fixed: true } }, {});
                const start = tf.getStart(new Date(2020, 5, 1, 12, 20, 12, 42));
                expect(start).toEqual(new Date(2020, 0, 1, 12, 20));
            });
        });
        describe("day", () => {
            it("should get the next day", () => {
                const tf = new TimeFrame({ day: { value: 1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 2, 12, 20));
            });
            it("should get the previous day", () => {
                const tf = new TimeFrame({ day: { value: -1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2019, 11, 31, 12, 20));
            });
            it("should set the day to the first", () => {
                const tf = new TimeFrame({ day: { value: 1, fixed: true } }, {});
                const start = tf.getStart(new Date(2020, 0, 13, 12, 20, 12, 42));
                expect(start).toEqual(new Date(2020, 0, 1, 12, 20));
            });
        });
        describe("hour", () => {
            it("should get the next hour", () => {
                const tf = new TimeFrame({ hour: { value: 1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 1, 13, 20));
            });
            it("should get the previous hour", () => {
                const tf = new TimeFrame({ hour: { value: -1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 1, 11, 20));
            });
            it("should set the hour to 0", () => {
                const tf = new TimeFrame({ hour: { value: 0, fixed: true } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 1, 0, 20));
            });
        });
        describe("minute", () => {
            it("should get the next minute", () => {
                const tf = new TimeFrame({ minute: { value: 1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 1, 12, 21));
            });
            it("should get the previous minute", () => {
                const tf = new TimeFrame({ minute: { value: -1 } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 1, 12, 19));
            });
            it("should set the minute to 0", () => {
                const tf = new TimeFrame({ minute: { value: 0, fixed: true } }, {});
                const start = tf.getStart(baseDate);
                expect(start).toEqual(new Date(2020, 0, 1, 12, 0));
            });
        });
    });
    describe("getEnd", () => {
        const baseDate = new Date(2020, 0, 1, 12, 20, 12, 42);
        it("should reset seconds and milliseconds but keep the rest for empty settings", () => {
            const tf = new TimeFrame({}, {});
            const end = tf.getEnd(baseDate);
            expect(end).toEqual(new Date(2020, 0, 1, 12, 20));
        });
        describe("year", () => {
            it("should get the next year", () => {
                const tf = new TimeFrame({}, { year: { value: 1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2021, 0, 1, 12, 20));
            });
            it("should get the previous year", () => {
                const tf = new TimeFrame({}, { year: { value: -1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2019, 0, 1, 12, 20));
            });
            it("should set the year to 2010", () => {
                const tf = new TimeFrame({}, { year: { value: 2010, fixed: true } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2010, 0, 1, 12, 20));
            });
        });
        describe("month", () => {
            it("should get the next month", () => {
                const tf = new TimeFrame({}, { month: { value: 1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 1, 1, 12, 20));
            });
            it("should get the previous month", () => {
                const tf = new TimeFrame({}, { month: { value: -1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2019, 11, 1, 12, 20));
            });
            it("should set the month to January", () => {
                const tf = new TimeFrame({}, { month: { value: 1, fixed: true } });
                const end = tf.getEnd(new Date(2020, 5, 1, 12, 20, 12, 42));
                expect(end).toEqual(new Date(2020, 0, 1, 12, 20));
            });
        });
        describe("day", () => {
            it("should get the next day", () => {
                const tf = new TimeFrame({}, { day: { value: 1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 2, 12, 20));
            });
            it("should get the previous day", () => {
                const tf = new TimeFrame({}, { day: { value: -1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2019, 11, 31, 12, 20));
            });
            it("should set the day to the first", () => {
                const tf = new TimeFrame({}, { day: { value: 1, fixed: true } });
                const end = tf.getEnd(new Date(2020, 0, 13, 12, 20, 12, 42));
                expect(end).toEqual(new Date(2020, 0, 1, 12, 20));
            });
        });
        describe("hour", () => {
            it("should get the next hour", () => {
                const tf = new TimeFrame({}, { hour: { value: 1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 1, 13, 20));
            });
            it("should get the previous hour", () => {
                const tf = new TimeFrame({}, { hour: { value: -1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 1, 11, 20));
            });
            it("should set the hour to 0", () => {
                const tf = new TimeFrame({}, { hour: { value: 0, fixed: true } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 1, 0, 20));
            });
        });
        describe("minute", () => {
            it("should get the next minute", () => {
                const tf = new TimeFrame({}, { minute: { value: 1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 1, 12, 21));
            });
            it("should get the previous minute", () => {
                const tf = new TimeFrame({}, { minute: { value: -1 } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 1, 12, 19));
            });
            it("should set the minute to 0", () => {
                const tf = new TimeFrame({}, { minute: { value: 0, fixed: true } });
                const end = tf.getEnd(baseDate);
                expect(end).toEqual(new Date(2020, 0, 1, 12, 0));
            });
        });
    });
    describe("getConfig", () => {
        it("should return the settings as a JSON", () => {
            const tf = new TimeFrame({ hour: { value: -10, fixed: false } }, { minute: { value: 0, fixed: true } });
            expect(tf.getConfig()).toEqual({
                begin: { hour: { value: -10, fixed: false } },
                end: { minute: { value: 0, fixed: true } },
            });
        });
    });

    describe("Scenarios", () => {
        it("during the current hour", () => {
            const tf = new TimeFrame(
                { minute: { value: 0, fixed: true } },
                { hour: { value: 1 }, minute: { value: 0, fixed: true } },
            );
            const date = new Date(2020, 4, 1, 17, 2, 13, 42);
            const start = tf.getStart(date);
            const end = tf.getEnd(date);
            expect(start).toEqual(new Date(2020, 4, 1, 17, 0));
            expect(end).toEqual(new Date(2020, 4, 1, 18, 0));
        });
        it("next day", () => {
            const tf = new TimeFrame(
                { day: { value: 1 }, hour: { value: 0, fixed: true }, minute: { value: 0, fixed: true } },
                { day: { value: 2 }, hour: { value: 0, fixed: true }, minute: { value: 0, fixed: true } },
            );
            const date = new Date(2020, 4, 1, 17, 2, 13, 42);
            const start = tf.getStart(date);
            const end = tf.getEnd(date);
            expect(start).toEqual(new Date(2020, 4, 2, 0, 0));
            expect(end).toEqual(new Date(2020, 4, 3, 0, 0));
        });
        it("next month", () => {
            const tf = new TimeFrame(
                {
                    month: { value: 1 },
                    day: { value: 1, fixed: true },
                    hour: { value: 0, fixed: true },
                    minute: { value: 0, fixed: true },
                },
                {
                    month: { value: 2 },
                    day: { value: 1, fixed: true },
                    hour: { value: 0, fixed: true },
                    minute: { value: 0, fixed: true },
                },
            );
            const date = new Date(2020, 4, 1, 17, 2, 13, 42);
            const start = tf.getStart(date);
            const end = tf.getEnd(date);
            expect(start).toEqual(new Date(2020, 5, 1, 0, 0));
            expect(end).toEqual(new Date(2020, 6, 1, 0, 0));
        });
    });
});
