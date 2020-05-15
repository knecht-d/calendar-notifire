import { IRecurrenceRule } from "../../interfaces";

export interface IChatPersistence {
    timeFrames: { [frameKey: string]: ISerializedTimeFrame };
    administrators: string[];
}

export interface ISerializedTimeFrame {
    begin: ITimeFrameSettings;
    end: ITimeFrameSettings;
    recurrence: IRecurrenceRule;
}

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
