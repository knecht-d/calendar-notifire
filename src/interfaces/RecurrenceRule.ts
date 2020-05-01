interface IBaseRecurrenceRule {
    type: RecurrenceType;
}

interface IHourlyRecurrenceRule extends IBaseRecurrenceRule {
    type: RecurrenceType.hourly;
    fromHour: number;
    fromMinute: number;
    toHour: number;
    toMinute: number;
    days: {
        monday?: boolean;
        tuesday?: boolean;
        wednesday?: boolean;
        thursday?: boolean;
        friday?: boolean;
        saturday?: boolean;
        sunday?: boolean;
    };
}

interface IDailyRecurrenceRule extends IBaseRecurrenceRule {
    type: RecurrenceType.daily;
    hour: number;
    minute: number;
    days: {
        monday?: boolean;
        tuesday?: boolean;
        wednesday?: boolean;
        thursday?: boolean;
        friday?: boolean;
        saturday?: boolean;
        sunday?: boolean;
    };
}

interface IMonthlyRecurrenceRule extends IBaseRecurrenceRule {
    type: RecurrenceType.monthly;
    day: number;
    hour: number;
    minute: number;
}

export type IRecurrenceRule = IHourlyRecurrenceRule | IDailyRecurrenceRule | IMonthlyRecurrenceRule;

export enum RecurrenceType {
    hourly = "h",
    daily = "d",
    monthly = "m",
}
