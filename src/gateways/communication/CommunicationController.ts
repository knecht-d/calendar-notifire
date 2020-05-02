import { IUpdateInput } from "../../useCases";
import { IUseCase } from "../../useCases/UseCase";
import { RecurrenceType, ITimeFrameSettings } from "../../interfaces";

export interface ICommunicationIn {
    update: (chatId: string, userId: string, payload: string) => void;
}

type Days = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
interface IMappings {
    recurrence: { [key: string]: RecurrenceType | undefined };
    timeFrames: { [key: string]: keyof ITimeFrameSettings };
    days: { [key in Days]: string };
}

export class CommunicationController implements ICommunicationIn {
    private readonly mappings: IMappings = {
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

    private readonly configExtractors = {
        [RecurrenceType.hourly]: this.extractHourlyConfig.bind(this),
        [RecurrenceType.daily]: this.extractDailyConfig.bind(this),
        [RecurrenceType.monthly]: this.extractMonthlyConfig.bind(this),
    };

    constructor(
        private useCases: {
            update: IUseCase<IUpdateInput, void>;
        },
    ) {}

    update(chatId: string, userId: string, payload: string) {
        const payloadParts = payload.trim().split(" ");
        const triggerId = payloadParts.shift()!;
        const recurrenceIdentifier = payloadParts.shift()!;
        const reccurenceType = this.mappings.recurrence[recurrenceIdentifier];
        if (!reccurenceType) {
            return;
        }
        const configExtractors = this.configExtractors;
        this.useCases.update.execute({
            chatId,
            userId,
            triggerId,
            config: configExtractors[reccurenceType](payloadParts),
        });
    }

    private extractMonthlyConfig(parts: string[]): IUpdateInput["config"] {
        const time = parts[1].split(":");
        const startConfig = parts[2];
        const endConfig = parts[3];
        return {
            recurrence: {
                type: RecurrenceType.monthly,
                day: Number.parseInt(parts[0]),
                hour: Number.parseInt(time[0]),
                minute: Number.parseInt(time[1]),
            },
            frameStart: this.extractFrame(startConfig),
            frameEnd: this.extractFrame(endConfig),
        };
    }

    private extractDailyConfig(parts: string[]): IUpdateInput["config"] {
        const days = parts[0].split(",");
        const time = parts[1].split(":");
        const startConfig = parts[2];
        const endConfig = parts[3];
        return {
            recurrence: {
                type: RecurrenceType.daily,
                days: {
                    monday: days.includes(this.mappings.days.monday),
                    tuesday: days.includes(this.mappings.days.tuesday),
                    wednesday: days.includes(this.mappings.days.wednesday),
                    thursday: days.includes(this.mappings.days.thursday),
                    friday: days.includes(this.mappings.days.friday),
                    saturday: days.includes(this.mappings.days.saturday),
                    sunday: days.includes(this.mappings.days.sunday),
                },
                hour: Number.parseInt(time[0]),
                minute: Number.parseInt(time[1]),
            },
            frameStart: this.extractFrame(startConfig),
            frameEnd: this.extractFrame(endConfig),
        };
    }

    private extractHourlyConfig(parts: string[]): IUpdateInput["config"] {
        const days = parts[0].toLowerCase().split(",");
        const timeFrom = parts[1].split(":");
        const timeTo = parts[2].split(":");
        const fromMinute = Number.parseInt(timeFrom[1]);
        const toMinute = Number.parseInt(timeTo[1]);
        const fromHour = Number.parseInt(timeFrom[0]);
        const toHour = Number.parseInt(timeTo[0]) - (toMinute >= fromMinute ? 0 : 1);
        const startConfig = parts[3];
        const endConfig = parts[4];
        return {
            recurrence: {
                type: RecurrenceType.hourly,
                days: {
                    monday: days.includes(this.mappings.days.monday),
                    tuesday: days.includes(this.mappings.days.tuesday),
                    wednesday: days.includes(this.mappings.days.wednesday),
                    thursday: days.includes(this.mappings.days.thursday),
                    friday: days.includes(this.mappings.days.friday),
                    saturday: days.includes(this.mappings.days.saturday),
                    sunday: days.includes(this.mappings.days.sunday),
                },
                fromHour,
                toHour,
                minute: fromMinute,
            },
            frameStart: this.extractFrame(startConfig),
            frameEnd: this.extractFrame(endConfig),
        };
    }

    private extractFrame(frameConfig: string): ITimeFrameSettings {
        if (frameConfig === "-") {
            return {};
        }
        const configParts = frameConfig.split(",");
        const result = configParts.reduce((config, current) => {
            const isFixed = !(current.includes("+") || current.includes("-"));
            config[this.mappings.timeFrames[current[0]]] = {
                value: Number.parseInt(current.slice(1)),
                fixed: isFixed,
            };
            return config;
        }, {} as ITimeFrameSettings);
        return result;
    }
}
