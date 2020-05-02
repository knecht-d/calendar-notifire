import { IRecurrenceRule } from "./RecurrenceRule";

export interface ITimeFrameSettings {
    year?: ITimeCalc;
    month?: ITimeCalc;
    day?: ITimeCalc;
    hour?: ITimeCalc;
    minute?: ITimeCalc;
}

export interface ITimeCalc {
    value: number;
    fixed?: boolean;
}

export interface ITimeFrameJSON {
    begin: ITimeFrameSettings;
    end: ITimeFrameSettings;
    recurrence: IRecurrenceRule;
}
