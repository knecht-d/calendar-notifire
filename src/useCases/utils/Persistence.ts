import { Chat, IRecurrenceSettings, RecurrenceType } from "../../entities";
import { IChatPersistence, IPersistedRecurrenceRule, ISerializedTimeFrame, PersistedRecurrenceType } from "../types";

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

export function convertChatToPersistence(chat: Chat): IChatPersistence {
    const chatConfig = chat.getConfig();
    const timeFrames = chatConfig.settings.reduce((frames, setting) => {
        frames[setting.key] = {
            begin: setting.frame.begin,
            end: setting.frame.end,
            recurrence: convertRecurrence(setting.recurrence),
        };
        return frames;
    }, {} as { [frameKey: string]: ISerializedTimeFrame });
    return {
        administrators: chatConfig.administrators,
        timeFrames,
    };
}
