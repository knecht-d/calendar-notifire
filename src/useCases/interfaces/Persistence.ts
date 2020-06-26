export interface IChatConfigSaver {
    saveChatConfig: (chatId: string, chat: IChatPersistence) => void;
}
export interface IChatConfigLoader {
    readAllChats: () => { [chatId: string]: IChatPersistence };
}

export enum PersistedRecurrenceType {
    hourly = "h",
    daily = "d",
    monthly = "m",
}

export interface IChatPersistence {
    timeFrames: { [frameKey: string]: ISerializedTimeFrame };
    administrators: string[];
}

export interface ISerializedTimeFrame {
    begin: ITimeFrameSettings;
    end: ITimeFrameSettings;
    recurrence: IPersistedRecurrenceRule;
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
    days: {
        monday?: boolean;
        tuesday?: boolean;
        wednesday?: boolean;
        thursday?: boolean;
        friday?: boolean;
        saturday?: boolean;
        sunday?: boolean;
    };
}

export interface IDailyRecurrenceRule extends IBaseRecurrenceRule {
    type: PersistedRecurrenceType.daily;
    hour: number;
    minute: number;
    days: {
        monday?: boolean;
        tuesday?: boolean;
        wednesday?: boolean;
        thursday?: boolean;
        friday?: boolean;
        saturday?: boolean;
        sunday?: boolean;
    };
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

export interface ITimeFrameJSON {
    begin: ITimeFrameSettings;
    end: ITimeFrameSettings;
    recurrence: IPersistedRecurrenceRule;
}
