import { DailyRecurrenceRule, HourlyRecurrenceRule, MonthlyRecurrenceRule, RecurrenceRule } from "../../entities";
import { IPersistedRecurrenceRule, PersistedRecurrenceType } from "../interfaces";

// TODO Make this a factory

export function createRecurrence(config: IPersistedRecurrenceRule): RecurrenceRule {
    let recurrence: RecurrenceRule;
    switch (config.type) {
        case PersistedRecurrenceType.daily:
            recurrence = new DailyRecurrenceRule(config.hour, config.minute, config.days);
            break;
        case PersistedRecurrenceType.hourly:
            recurrence = new HourlyRecurrenceRule(config.fromHour, config.toHour, config.minute, config.days);
            break;
        case PersistedRecurrenceType.monthly:
            recurrence = new MonthlyRecurrenceRule(config.hour, config.minute, config.day);
            break;
    }
    return recurrence;
}
