import { DailyRecurrenceRule, HourlyRecurrenceRule, MonthlyRecurrenceRule } from "../../../../src/entities";
import { IPersistedRecurrenceRule, PersistedRecurrenceType } from "../../../../src/useCases";
import { createRecurrence } from "../../../../src/useCases/utils";

jest.mock("../../../../src/entities");
describe("TimeFrame Utils", () => {
    describe("createRecurrence", () => {
        it("shouuld create a daily recurrence rule", () => {
            const persistedConfig: IPersistedRecurrenceRule = {
                type: PersistedRecurrenceType.daily,
                days: {
                    monday: true,
                    tuesday: true,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                },
                hour: 14,
                minute: 5,
            };
            const result = createRecurrence(persistedConfig);
            expect(DailyRecurrenceRule).toHaveBeenCalledWith(14, 5, {
                monday: true,
                tuesday: true,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            });
            expect(result).toEqual((DailyRecurrenceRule as jest.Mock).mock.instances[0]);
        });
        it("shouuld create a hourly recurrence rule", () => {
            const persistedConfig: IPersistedRecurrenceRule = {
                type: PersistedRecurrenceType.hourly,
                days: {
                    monday: true,
                    tuesday: true,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                },
                fromHour: 7,
                toHour: 20,
                minute: 30,
            };
            const result = createRecurrence(persistedConfig);
            expect(HourlyRecurrenceRule).toHaveBeenCalledWith(7, 20, 30, {
                monday: true,
                tuesday: true,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            });
            expect(result).toEqual((HourlyRecurrenceRule as jest.Mock).mock.instances[0]);
        });
        it("shouuld create a mohtly recurrence rule", () => {
            const persistedConfig: IPersistedRecurrenceRule = {
                type: PersistedRecurrenceType.monthly,
                day: 25,
                hour: 14,
                minute: 5,
            };
            const result = createRecurrence(persistedConfig);
            expect(MonthlyRecurrenceRule).toHaveBeenCalledWith(14, 5, 25);
            expect(result).toEqual((MonthlyRecurrenceRule as jest.Mock).mock.instances[0]);
        });
    });
});
