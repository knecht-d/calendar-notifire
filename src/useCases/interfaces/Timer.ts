import { IPersistedRecurrenceRule } from "./Persistence";

export interface ITriggerSetter {
    set: (chatId: string, triggerId: string, recurrence: IPersistedRecurrenceRule) => void;
}

export interface ITriggerStopper {
    stop: (chatId: string, triggerId: string) => void;
}

export interface ITriggerRead {
    getNext: (chatId: string, triggerId: string) => Date;
}
