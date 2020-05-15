import { DailyRecurrenceRule, HourlyRecurrenceRule, MonthlyRecurrenceRule, RecurrenceType } from "../../src/entities";

describe("RecurrenceRule", () => {
    const days = {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    };
    describe("HourlyRecurrenceRule", () => {
        describe("getSettings", () => {
            it("should return the settings", () => {
                const rule = new HourlyRecurrenceRule(10, 20, 0, days);
                const result = rule.getSettings();
                expect(result).toEqual({
                    type: RecurrenceType.hourly,
                    hour: 10,
                    minute: 0,
                    toHour: 20,
                    weekDays: days,
                });
            });
        });
    });
    describe("DailyRecurrenceRule", () => {
        describe("getSettings", () => {
            it("should return the settings", () => {
                const rule = new DailyRecurrenceRule(10, 0, days);
                const result = rule.getSettings();
                expect(result).toEqual({
                    type: RecurrenceType.daily,
                    hour: 10,
                    minute: 0,
                    weekDays: days,
                });
            });
        });
    });
    describe("MonthlyRecurrenceRule", () => {
        describe("getSettings", () => {
            it("should return the settings", () => {
                const rule = new MonthlyRecurrenceRule(10, 20, 13);
                const result = rule.getSettings();
                expect(result).toEqual({
                    type: RecurrenceType.monthly,
                    hour: 10,
                    minute: 20,
                    dayOfMonth: 13,
                });
            });
        });
    });
});
