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
import { IGenericConfig, IGenericFrame } from "./interfaces";
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
        [PersistedRecurrenceType.hourly]: this.extractAndValidateHourlyConfig.bind(this),
        [PersistedRecurrenceType.daily]: this.extractAndValidateDailyConfig.bind(this),
        [PersistedRecurrenceType.monthly]: this.extractAndValidateMonthlyConfig.bind(this),
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
            const triggerId = payload.trim();
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
            const recurrenceIdentifier = config.recurrence?.type;
            const reccurenceTypes = Object.keys(this.configExtractors);
            if (!recurrenceIdentifier || !reccurenceTypes.includes(recurrenceIdentifier)) {
                throw new CommunicationError(CommunicationErrorCode.INVALID_RECURRENCE_TYPE, recurrenceIdentifier);
            }
            await this.dependencies!.useCases.config.set.execute({
                chatId,
                userId,
                triggerId,
                config: this.configExtractors[recurrenceIdentifier](config),
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

    private extractAndValidateMonthlyConfig(configIn: IGenericConfig): ISetConfigInput["config"] {
        const recurrence: Partial<IMonthlyRecurrenceRule> = {
            type: PersistedRecurrenceType.monthly,
            day: configIn.recurrence?.dayOfMonth,
            hour: configIn.recurrence?.hour,
            minute: configIn.recurrence?.minute,
        };
        validateMonthlyConfig(recurrence);

        const configOut: ISetConfigInput["config"] = {
            recurrence: recurrence as IMonthlyRecurrenceRule,
            frame: {
                begin: this.extractAndValidateFrame(configIn.frame?.begin),
                end: this.extractAndValidateFrame(configIn.frame?.end),
            },
        };
        return configOut;
    }

    private extractAndValidateDailyConfig(configIn: IGenericConfig): ISetConfigInput["config"] {
        const recurrence: Partial<IDailyRecurrenceRule> = {
            type: PersistedRecurrenceType.daily,
            days: configIn.recurrence?.daysOfWeek,
            hour: configIn.recurrence?.hour,
            minute: configIn.recurrence?.minute,
        };
        validateDailyConfig(recurrence);

        const configOut: ISetConfigInput["config"] = {
            recurrence: recurrence as IDailyRecurrenceRule,
            frame: {
                begin: this.extractAndValidateFrame(configIn.frame?.begin),
                end: this.extractAndValidateFrame(configIn.frame?.end),
            },
        };
        return configOut;
    }

    private extractAndValidateHourlyConfig(configIn: IGenericConfig): ISetConfigInput["config"] {
        const recurrence: Partial<IHourlyRecurrenceRule> = {
            type: PersistedRecurrenceType.hourly,
            days: configIn.recurrence?.daysOfWeek,
            fromHour: configIn.recurrence?.hour,
            toHour: configIn.recurrence?.hourEnd,
            minute: configIn.recurrence?.minute,
        };
        validateHourlyConfig(recurrence);

        const configOut: ISetConfigInput["config"] = {
            recurrence: recurrence as IHourlyRecurrenceRule,
            frame: {
                begin: this.extractAndValidateFrame(configIn.frame?.begin),
                end: this.extractAndValidateFrame(configIn.frame?.end),
            },
        };
        return configOut;
    }

    private extractAndValidateFrame(frameConfig: IGenericFrame = {}): ITimeFrameSettings {
        validateTimeFrame(frameConfig);
        return frameConfig as ITimeFrameSettings;
    }
}
