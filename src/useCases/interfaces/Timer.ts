import { IPersistedRecurrenceRule } from "./Persistence";

export interface ITimerSetter {
    set: (chatId: string, triggerId: string, recurrence: IPersistedRecurrenceRule) => void;
}

export interface ITimerStopper {
    stop: (chatId: string, triggerId: string) => void;
}
