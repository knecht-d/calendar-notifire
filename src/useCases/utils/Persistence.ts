import { Chat, IRecurrenceSettings, RecurrenceType } from "../../entities";
import { IPersistedRecurrenceRule, ISerializedChat, ISerializedTrigger, PersistedRecurrenceType } from "../interfaces";

export function convertRecurrence(settings: IRecurrenceSettings): IPersistedRecurrenceRule {
    switch (settings.type) {
        case RecurrenceType.daily:
            return {
                type: PersistedRecurrenceType.daily,
                days: settings.weekDays,
                hour: settings.hour,
                minute: settings.minute,
            };
        case RecurrenceType.hourly:
            return {
                type: PersistedRecurrenceType.hourly,
                days: settings.weekDays,
                fromHour: settings.hour,
                toHour: settings.toHour,
                minute: settings.minute,
            };
        case RecurrenceType.monthly:
            return {
                type: PersistedRecurrenceType.monthly,
                day: settings.dayOfMonth,
                hour: settings.hour,
                minute: settings.minute,
            };
    }
}

export function convertChatToPersistence(chat: Chat): ISerializedChat {
    const chatConfig = chat.getConfig();
    const triggers = chatConfig.settings.reduce((triggers, setting) => {
        triggers[setting.key] = {
            frame: {
                begin: setting.frame.begin,
                end: setting.frame.end,
            },
            recurrence: convertRecurrence(setting.recurrence),
        };
        return triggers;
    }, {} as { [triggerKey: string]: ISerializedTrigger });
    return {
        administrators: chatConfig.administrators,
        triggerSettings: triggers,
    };
}
