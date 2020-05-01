interface IBaseRecurrenceRule {
    type: ReccurenceType;
}

interface IHourlyRecurrenceRule extends IBaseRecurrenceRule {
    type: ReccurenceType.hourly;
    from: number;
    to: number;
}

interface IDailyRecurrenceRule extends IBaseRecurrenceRule {
    type: ReccurenceType.daily;
    hour: number;
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

interface IMonthlyRecurrenceRule extends IBaseRecurrenceRule {
    type: ReccurenceType.monthly;
    hour: number;
    days: number;
}

export type IRecurrenceRule = IHourlyRecurrenceRule | IDailyRecurrenceRule | IMonthlyRecurrenceRule;

export enum ReccurenceType {
    hourly,
    daily,
    monthly,
}
