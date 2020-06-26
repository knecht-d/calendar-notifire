import {
    AddAdmin,
    DeleteConfig,
    IDailyRecurrenceRule,
    IHourlyRecurrenceRule,
    IMonthlyRecurrenceRule,
    InitializeChat,
    ISetConfigInput,
    ITimeFrameSettings,
    PersistedRecurrenceType,
    ReadConfig,
    RemoveAdmin,
    SetConfig,
} from "../../useCases";
import { GateWay } from "../GateWay";
import { logCall } from "../logging";
import { CommunicationError, CommunicationErrorCode } from "./CommunicationError";
import { IErrorReporter } from "./CommunicationPresenter";
import { GenericDaysDaysOfWeek, IGenericConfig, IGenericFrame } from "./interfaces";
import { Mappings } from "./Mappings";
import { validateDailyConfig, validateHourlyConfig, validateMonthlyConfig, validateTimeFrame } from "./validation";

export interface ICommunicationIn {
    set: (chatId: string, userId: string, triggerId: string, config: IGenericConfig) => Promise<void>;
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

    @logCall()
    async read(chatId: string) {
        this.checkInitialized();
        await this.dependencies!.useCases.config.read.execute({ chatId });
    }

    @logCall()
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

    @logCall()
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

    @logCall()
    async set(chatId: string, userId: string, triggerId: string, config: IGenericConfig) {
        this.checkInitialized();
        try {
            if (!triggerId) {
                throw new CommunicationError(CommunicationErrorCode.MISSING_TRIGGER_ID);
            }
            const recurrenceIdentifier = config.recurrence?.type || "";
            const reccurenceType = Mappings.recurrence[recurrenceIdentifier];
            if (!reccurenceType) {
                throw new CommunicationError(CommunicationErrorCode.INVALID_RECURRENCE_TYPE, recurrenceIdentifier);
            }
            const configExtractors = this.configExtractors;
            await this.dependencies!.useCases.config.set.execute({
                chatId,
                userId,
                triggerId,
                config: configExtractors[reccurenceType](config),
            });
            await Promise.resolve();
        } catch (error) {
            if (error instanceof CommunicationError) {
                this.dependencies!.presenter.sendCommunicationError(chatId, error);
            } else {
                this.dependencies!.presenter.sendError(chatId, `${error}`);
            }
        }
    }

    @logCall()
    async addAdmin(chatId: string, userId: string, payload: string) {
        this.checkInitialized();
        const adminId = payload
            .trim()
            .replace(/\s+/gm, " ")
            .split(" ")[0];
        await this.dependencies!.useCases.admin.add.execute({ chatId, userId, adminId });
    }

    @logCall()
    async removeAdmin(chatId: string, userId: string, payload: string) {
        this.checkInitialized();
        const adminId = payload
            .trim()
            .replace(/\s+/gm, " ")
            .split(" ")[0];
        await this.dependencies!.useCases.admin.remove.execute({ chatId, userId, adminId });
    }

    private toInt(value?: string | number) {
        if (value !== undefined) {
            if (typeof value === "string") {
                return parseInt(value);
            } else {
                return value;
            }
        }
    }

    private extractMonthlyConfig(configIn: IGenericConfig): ISetConfigInput["config"] {
        const recurrence: Partial<IMonthlyRecurrenceRule> = {
            type: PersistedRecurrenceType.monthly,
            day: this.toInt(configIn.recurrence?.dayOfMonth),
            hour: this.toInt(configIn.recurrence?.hour),
            minute: this.toInt(configIn.recurrence?.minute),
        };
        validateMonthlyConfig(recurrence);

        const configOut: ISetConfigInput["config"] = {
            recurrence: recurrence as IMonthlyRecurrenceRule,
            frameStart: this.extractFrame(configIn.frameStart),
            frameEnd: this.extractFrame(configIn.frameEnd),
        };
        return configOut;
    }

    private toDays(value?: string | string[] | number[] | GenericDaysDaysOfWeek) {
        if (!value) {
            return;
        }
        if (typeof value === "object" && !Array.isArray(value)) {
            return value;
        }
        function includes(values: string[] | number[], searched: { string: string; int: number }) {
            if (typeof values[0] === "string") {
                return (values as string[]).includes(searched.string);
            } else {
                return (values as number[]).includes(searched.int);
            }
        }
        const values = Array.isArray(value) ? value : value.split(",");
        return {
            sunday: includes(values, { string: Mappings.days.sunday, int: 0 }),
            monday: includes(values, { string: Mappings.days.monday, int: 1 }),
            tuesday: includes(values, { string: Mappings.days.tuesday, int: 2 }),
            wednesday: includes(values, { string: Mappings.days.wednesday, int: 3 }),
            thursday: includes(values, { string: Mappings.days.thursday, int: 4 }),
            friday: includes(values, { string: Mappings.days.friday, int: 5 }),
            saturday: includes(values, { string: Mappings.days.saturday, int: 6 }),
        };
    }

    private extractDailyConfig(configIn: IGenericConfig): ISetConfigInput["config"] {
        const recurrence: Partial<IDailyRecurrenceRule> = {
            type: PersistedRecurrenceType.daily,
            days: this.toDays(configIn.recurrence?.daysOfWeek),
            hour: this.toInt(configIn.recurrence?.hour),
            minute: this.toInt(configIn.recurrence?.minute),
        };
        validateDailyConfig(recurrence);

        const configOut: ISetConfigInput["config"] = {
            recurrence: recurrence as IDailyRecurrenceRule,
            frameStart: this.extractFrame(configIn.frameStart),
            frameEnd: this.extractFrame(configIn.frameEnd),
        };
        return configOut;
    }

    private extractHourlyConfig(configIn: IGenericConfig): ISetConfigInput["config"] {
        const recurrence: Partial<IHourlyRecurrenceRule> = {
            type: PersistedRecurrenceType.hourly,
            days: this.toDays(configIn.recurrence?.daysOfWeek),
            fromHour: this.toInt(configIn.recurrence?.hour),
            toHour: this.toInt(configIn.recurrence?.hourEnd),
            minute: this.toInt(configIn.recurrence?.minute),
        };
        validateHourlyConfig(recurrence);

        const configOut: ISetConfigInput["config"] = {
            recurrence: recurrence as IHourlyRecurrenceRule,
            frameStart: this.extractFrame(configIn.frameStart),
            frameEnd: this.extractFrame(configIn.frameEnd),
        };
        return configOut;
    }

    private extractFrame(frameConfig: IGenericFrame = {}): ITimeFrameSettings {
        validateTimeFrame(frameConfig);
        return frameConfig as ITimeFrameSettings;
    }
}
