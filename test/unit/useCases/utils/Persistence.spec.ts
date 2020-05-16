import { Chat, IRecurrenceSettings, MonthlyRecurrenceRule, RecurrenceType, TimeFrame } from "../../../../src/entities";
import { IPersistedRecurrenceRule, PersistedRecurrenceType } from "../../../../src/useCases";
import { convertChatToPersistence, convertRecurrence } from "../../../../src/useCases/utils";

describe("Persistence Utils", () => {
    describe("convertRecurrence", () => {
        it("should convert daily recurrence", () => {
            const internalRecurrence: IRecurrenceSettings = {
                type: RecurrenceType.daily,
                weekDays: {
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
            };
            const result = convertRecurrence(internalRecurrence);

            const externalRecurrence: IPersistedRecurrenceRule = {
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
                hour: 17,
                minute: 0,
            };

            expect(result).toEqual(externalRecurrence);
        });
        it("should convert horly recurrence", () => {
            const internalRecurrence: IRecurrenceSettings = {
                type: RecurrenceType.hourly,
                weekDays: {
                    monday: true,
                    tuesday: true,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                },
                hour: 7,
                toHour: 20,
                minute: 30,
            };
            const result = convertRecurrence(internalRecurrence);

            const externalRecurrence: IPersistedRecurrenceRule = {
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

            expect(result).toEqual(externalRecurrence);
        });
        it("should convert monthly recurrence", () => {
            const internalRecurrence: IRecurrenceSettings = {
                type: RecurrenceType.monthly,
                dayOfMonth: 25,
                hour: 14,
                minute: 5,
            };
            const result = convertRecurrence(internalRecurrence);

            const externalRecurrence: IPersistedRecurrenceRule = {
                type: PersistedRecurrenceType.monthly,
                day: 25,
                hour: 14,
                minute: 5,
            };

            expect(result).toEqual(externalRecurrence);
        });
    });
    describe("convertChatToPersistence", () => {
        it("shouuld convert a chat", () => {
            const chat = new Chat(["admin1", "admin2"]);
            chat.setTimeFrame(
                "tf1",
                {
                    frame: new TimeFrame({ hour: { value: 0, fixed: true } }, { hour: { value: 0 } }),
                    recurrence: new MonthlyRecurrenceRule(14, 5, 25),
                },
                "admin1",
            );
            const result = convertChatToPersistence(chat);
            expect(result).toEqual({
                administrators: ["admin1", "admin2"],
                timeFrames: {
                    tf1: {
                        begin: { hour: { value: 0, fixed: true } },
                        end: { hour: { value: 0 } },
                        recurrence: {
                            type: PersistedRecurrenceType.monthly,
                            day: 25,
                            hour: 14,
                            minute: 5,
                        },
                    },
                },
            });
        });
    });
});
