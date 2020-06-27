export interface IGenericRecurrence {
    type?: RecurrenceType;
    dayOfMonth?: number;
    hour?: number;
    hourEnd?: number;
    minute?: number;
    daysOfWeek?: GenericDaysDaysOfWeek;
}

export interface IGenericFrame {
    year?: IGenericFrameEntry;
    month?: IGenericFrameEntry;
    day?: IGenericFrameEntry;
    hour?: IGenericFrameEntry;
    minute?: IGenericFrameEntry;
}
export interface IGenericFrameEntry {
    value?: number;
    fixed?: boolean;
}

export interface IGenericConfig {
    recurrence?: IGenericRecurrence;
    frameStart?: IGenericFrame;
    frameEnd?: IGenericFrame;
}

export type GenericDaysDaysOfWeek = {
    sunday?: boolean;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
};
export type RecurrenceType = "h" | "d" | "m";
