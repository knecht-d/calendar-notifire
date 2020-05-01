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
