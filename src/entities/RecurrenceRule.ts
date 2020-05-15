export enum RecurrenceType {
    hourly = "h",
    daily = "d",
    monthly = "m",
}
type Days = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type DayFlags = { [day in Days]?: boolean };

interface IBaseRecurrenceSettings {
    type: RecurrenceType;
    hour: number;
    minute: number;
}
interface IHourlyRecurrenceSettings extends IBaseRecurrenceSettings {
    type: RecurrenceType.hourly;
    toHour: number;
    weekDays: DayFlags;
}
interface IDailyRecurrenceSettings extends IBaseRecurrenceSettings {
    type: RecurrenceType.daily;
    weekDays: DayFlags;
}
interface IMonthlyRecurrenceSettings extends IBaseRecurrenceSettings {
    type: RecurrenceType.monthly;
    dayOfMonth: number;
}
export type IRecurrenceSettings = IMonthlyRecurrenceSettings | IDailyRecurrenceSettings | IHourlyRecurrenceSettings;

export abstract class RecurrenceRule {
    constructor(protected type: RecurrenceType, protected hour: number, protected minute: number) {}
    protected getBaseSetting(): IBaseRecurrenceSettings {
        return {
            type: this.type,
            hour: this.hour,
            minute: this.minute,
        };
    }
    abstract getSettings(): IRecurrenceSettings;
}

export class HourlyRecurrenceRule extends RecurrenceRule {
    constructor(fromHour: number, private toHour: number, minute: number, private weekDays: DayFlags) {
        super(RecurrenceType.hourly, fromHour, minute);
    }
    getSettings(): IHourlyRecurrenceSettings {
        return {
            ...super.getBaseSetting(),
            type: RecurrenceType.hourly,
            toHour: this.toHour,
            weekDays: this.weekDays,
        };
    }
}

export class DailyRecurrenceRule extends RecurrenceRule {
    constructor(hour: number, minute: number, private weekDays: DayFlags) {
        super(RecurrenceType.daily, hour, minute);
    }
    getSettings(): IDailyRecurrenceSettings {
        return {
            ...super.getBaseSetting(),
            type: RecurrenceType.daily,
            weekDays: this.weekDays,
        };
    }
}

export class MonthlyRecurrenceRule extends RecurrenceRule {
    constructor(hour: number, minute: number, private dayOfMonth: number) {
        super(RecurrenceType.monthly, hour, minute);
    }
    getSettings(): IMonthlyRecurrenceSettings {
        return {
            ...super.getBaseSetting(),
            type: RecurrenceType.monthly,
            dayOfMonth: this.dayOfMonth,
        };
    }
}
