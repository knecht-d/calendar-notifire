import { RecurrenceType, ITimeFrameSettings } from "../../interfaces";

type Days = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
interface IMappings {
    recurrence: { [key: string]: RecurrenceType | undefined };
    timeFrames: { [key: string]: keyof ITimeFrameSettings };
    days: { [key in Days]: string };
}

export const Mappings: IMappings = {
    recurrence: {
        s: RecurrenceType.hourly,
        t: RecurrenceType.daily,
        m: RecurrenceType.monthly,
    },
    timeFrames: {
        j: "year",
        M: "month",
        t: "day",
        s: "hour",
        m: "minute",
    },
    days: {
        monday: "mo",
        tuesday: "di",
        wednesday: "mi",
        thursday: "do",
        friday: "fr",
        saturday: "sa",
        sunday: "so",
    },
};
