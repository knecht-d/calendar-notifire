import { ITimeCalc, ITimeFrameSettings, IRecurrenceRule } from "../interfaces";

export class TimeFrame {
    private static DEFAULT_SETTING: ITimeCalc = { value: 0 };
    constructor(
        private begin: ITimeFrameSettings,
        private end: ITimeFrameSettings,
        private recurrence: IRecurrenceRule,
    ) {}

    public getStart(baseDate: Date) {
        const start = new Date(baseDate);
        this.truncateSeconds(start);
        this.calculateYear(start, baseDate, this.begin.year);
        this.calculateMonth(start, baseDate, this.begin.month);
        this.calculateDay(start, baseDate, this.begin.day);
        this.calculateHour(start, baseDate, this.begin.hour);
        this.calculateMinute(start, baseDate, this.begin.minute);
        return start;
    }

    public getEnd(baseDate: Date) {
        const end = new Date(baseDate);
        this.truncateSeconds(end);
        this.calculateYear(end, baseDate, this.end.year);
        this.calculateMonth(end, baseDate, this.end.month);
        this.calculateDay(end, baseDate, this.end.day);
        this.calculateHour(end, baseDate, this.end.hour);
        this.calculateMinute(end, baseDate, this.end.minute);
        return end;
    }

    public toJSON() {
        return {
            begin: this.begin,
            end: this.end,
            recurrence: this.recurrence,
        };
    }

    private truncateSeconds(newDate: Date) {
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
    }

    private calculateYear(newDate: Date, baseDate: Date, setting: ITimeCalc = TimeFrame.DEFAULT_SETTING) {
        if (setting.fixed) {
            newDate.setFullYear(setting.value);
        } else {
            newDate.setFullYear(baseDate.getFullYear() + setting.value);
        }
    }

    private calculateMonth(newDate: Date, baseDate: Date, setting: ITimeCalc = TimeFrame.DEFAULT_SETTING) {
        if (setting.fixed) {
            newDate.setMonth(setting.value - 1);
        } else {
            newDate.setMonth(baseDate.getMonth() + setting.value);
        }
    }

    private calculateDay(newDate: Date, baseDate: Date, setting: ITimeCalc = TimeFrame.DEFAULT_SETTING) {
        if (setting.fixed) {
            newDate.setDate(setting.value);
        } else {
            newDate.setDate(baseDate.getDate() + setting.value);
        }
    }

    private calculateHour(newDate: Date, baseDate: Date, setting: ITimeCalc = TimeFrame.DEFAULT_SETTING) {
        if (setting.fixed) {
            newDate.setHours(setting.value);
        } else {
            newDate.setHours(baseDate.getHours() + setting.value);
        }
    }

    private calculateMinute(newDate: Date, baseDate: Date, setting: ITimeCalc = TimeFrame.DEFAULT_SETTING) {
        if (setting.fixed) {
            newDate.setMinutes(setting.value);
        } else {
            newDate.setMinutes(baseDate.getMinutes() + setting.value);
        }
    }
}
