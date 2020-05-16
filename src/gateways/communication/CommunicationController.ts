import {
    AddAdmin,
    DeleteConfig,
    InitializeChat,
    ISetConfigInput,
    ITimeFrameSettings,
    PersistedRecurrenceType,
    ReadConfig,
    RemoveAdmin,
    SetConfig,
} from "../../useCases";
import { GateWay } from "../GateWay";
import { CommunicationError, CommunicationErrorCode } from "./CommunicationError";
import { IErrorReporter } from "./CommunicationPresenter";
import { Mappings } from "./Mappings";
import { validateDailyConfig, validateHourlyConfig, validateMonthlyConfig } from "./validation";

export interface ICommunicationIn {
    set: (chatId: string, userId: string, payload: string) => Promise<void>;
    delete: (chatId: string, userId: string, payload: string) => Promise<void>;
    initChat: (chatId: string, userId: string) => Promise<void>;
    addAdmin: (chatId: string, userId: string, payload: string) => Promise<void>;
    removeAdmin: (chatId: string, userId: string, payload: string) => Promise<void>;
    read: (chatId: string) => Promise<void>;
}

interface IDependencies {
    presenter: IErrorReporter;
    useCases: {
        config: {
            delete: DeleteConfig;
            read: ReadConfig;
            set: SetConfig;
        };
        admin: {
            init: InitializeChat;
            add: AddAdmin;
            remove: RemoveAdmin;
        };
    };
}

export class CommunicationController extends GateWay<IDependencies> implements ICommunicationIn {
    private readonly configExtractors = {
        [PersistedRecurrenceType.hourly]: this.extractHourlyConfig.bind(this),
        [PersistedRecurrenceType.daily]: this.extractDailyConfig.bind(this),
        [PersistedRecurrenceType.monthly]: this.extractMonthlyConfig.bind(this),
    };

    async read(chatId: string) {
        this.checkInitialized();
        await this.dependencies!.useCases.config.read.execute({ chatId });
    }

    async initChat(chatId: string, userId: string) {
        this.checkInitialized();
        try {
            await this.dependencies!.useCases.admin.init.execute({
                chatId,
                userId,
            });
        } catch (error) {
            this.dependencies!.presenter.sendError(chatId, `${error}`);
        }
    }

    async delete(chatId: string, userId: string, payload: string) {
        this.checkInitialized();
        try {
            const triggerId = payload
                .trim()
                .replace(/\s+/gm, " ")
                .split(" ")[0];
            if (!triggerId) {
                throw new CommunicationError(CommunicationErrorCode.MISSING_TRIGGER_ID);
            }
            await this.dependencies!.useCases.config.delete.execute({ chatId, userId, triggerId });
        } catch (error) {
            if (error instanceof CommunicationError) {
                this.dependencies!.presenter.sendCommunicationError(chatId, error);
            } else {
                this.dependencies!.presenter.sendError(chatId, `${error}`);
            }
        }
    }

    async set(chatId: string, userId: string, payload: string) {
        this.checkInitialized();
        try {
            const payloadParts = payload
                .trim()
                .replace(/\s+/gm, " ")
                .split(" ");
            const triggerId = payloadParts.shift()!;
            const recurrenceIdentifier = payloadParts.shift()!;
            const reccurenceType = Mappings.recurrence[recurrenceIdentifier];
            if (!reccurenceType) {
                throw new CommunicationError(
                    CommunicationErrorCode.INVALID_RECURRENCE_TYPE,
                    recurrenceIdentifier,
                    "m,t,s",
                );
            }
            const configExtractors = this.configExtractors;
            await this.dependencies!.useCases.config.set.execute({
                chatId,
                userId,
                triggerId,
                config: configExtractors[reccurenceType](payloadParts),
            });
        } catch (error) {
            if (error instanceof CommunicationError) {
                this.dependencies!.presenter.sendCommunicationError(chatId, error);
            } else {
                this.dependencies!.presenter.sendError(chatId, `${error}`);
            }
        }
    }

    async addAdmin(chatId: string, userId: string, payload: string) {
        this.checkInitialized();
        const adminId = payload
            .trim()
            .replace(/\s+/gm, " ")
            .split(" ")[0];
        await this.dependencies!.useCases.admin.add.execute({ chatId, userId, adminId });
    }
    async removeAdmin(chatId: string, userId: string, payload: string) {
        this.checkInitialized();
        const adminId = payload
            .trim()
            .replace(/\s+/gm, " ")
            .split(" ")[0];
        await this.dependencies!.useCases.admin.remove.execute({ chatId, userId, adminId });
    }

    private extractMonthlyConfig(parts: string[]): ISetConfigInput["config"] {
        validateMonthlyConfig(parts);
        const time = parts[1].split(":");
        const startConfig = parts[2];
        const endConfig = parts[3];
        return {
            recurrence: {
                type: PersistedRecurrenceType.monthly,
                day: Number.parseInt(parts[0]),
                hour: Number.parseInt(time[0]),
                minute: Number.parseInt(time[1]),
            },
            frameStart: this.extractFrame(startConfig),
            frameEnd: this.extractFrame(endConfig),
        };
    }

    private extractDailyConfig(parts: string[]): ISetConfigInput["config"] {
        validateDailyConfig(parts);
        const days = parts[0].split(",");
        const time = parts[1].split(":");
        const startConfig = parts[2];
        const endConfig = parts[3];
        return {
            recurrence: {
                type: PersistedRecurrenceType.daily,
                days: {
                    monday: days.includes(Mappings.days.monday),
                    tuesday: days.includes(Mappings.days.tuesday),
                    wednesday: days.includes(Mappings.days.wednesday),
                    thursday: days.includes(Mappings.days.thursday),
                    friday: days.includes(Mappings.days.friday),
                    saturday: days.includes(Mappings.days.saturday),
                    sunday: days.includes(Mappings.days.sunday),
                },
                hour: Number.parseInt(time[0]),
                minute: Number.parseInt(time[1]),
            },
            frameStart: this.extractFrame(startConfig),
            frameEnd: this.extractFrame(endConfig),
        };
    }

    private extractHourlyConfig(parts: string[]): ISetConfigInput["config"] {
        validateHourlyConfig(parts);
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
                type: PersistedRecurrenceType.hourly,
                days: {
                    monday: days.includes(Mappings.days.monday),
                    tuesday: days.includes(Mappings.days.tuesday),
                    wednesday: days.includes(Mappings.days.wednesday),
                    thursday: days.includes(Mappings.days.thursday),
                    friday: days.includes(Mappings.days.friday),
                    saturday: days.includes(Mappings.days.saturday),
                    sunday: days.includes(Mappings.days.sunday),
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
            config[Mappings.timeFrames[current[0]]] = {
                value: Number.parseInt(current.slice(1)),
                fixed: isFixed,
            };
            return config;
        }, {} as ITimeFrameSettings);
        return result;
    }
}
