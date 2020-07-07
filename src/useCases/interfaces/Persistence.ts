export interface IChatConfigSaver {
    saveChatConfig: (chatId: string, chat: ISerializedChat) => void;
}
export interface IChatConfigLoader {
    readAllChats: () => { [chatId: string]: ISerializedChat };
}

export enum PersistedRecurrenceType {
    hourly = "h",
    daily = "d",
    monthly = "m",
}

export interface IDaysOfWeekConfig {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
}

export interface ISerializedChat {
    triggerSettings: { [triggerKey: string]: ISerializedTrigger };
    administrators: string[];
}

export interface ISerializedTrigger {
    frame: {
        begin: ITimeFrameSettings;
        end: ITimeFrameSettings;
    };
    recurrence: IPersistedRecurrenceRule;
    nextExecution?: {
        date: Date;
        from: Date;
        to: Date;
    };
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

interface IBaseRecurrenceRule {
    type: PersistedRecurrenceType;
}

export interface IHourlyRecurrenceRule extends IBaseRecurrenceRule {
    type: PersistedRecurrenceType.hourly;
    fromHour: number;
    toHour: number;
    minute: number;
    days: IDaysOfWeekConfig;
}

export interface IDailyRecurrenceRule extends IBaseRecurrenceRule {
    type: PersistedRecurrenceType.daily;
    hour: number;
    minute: number;
    days: IDaysOfWeekConfig;
}

export interface IMonthlyRecurrenceRule extends IBaseRecurrenceRule {
    type: PersistedRecurrenceType.monthly;
    day: number;
    hour: number;
    minute: number;
}

export type IPersistedRecurrenceRule = IHourlyRecurrenceRule | IDailyRecurrenceRule | IMonthlyRecurrenceRule;

export interface ITimeCalc {
    value: number;
    fixed?: boolean;
}
