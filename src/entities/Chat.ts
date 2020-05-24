import { EntityError, EntityErrorCode } from "./EntityError";
import { IRecurrenceSettings, RecurrenceRule } from "./RecurrenceRule";
import { ITimeFrameConfig, TimeFrame } from "./TimeFrame";

export interface IChatConfig {
    administrators: string[];
    settings: Array<{
        key: string;
        frame: ITimeFrameConfig;
        recurrence: IRecurrenceSettings;
    }>;
}

export class Chat {
    private settings: { [frameId: string]: { frame: TimeFrame; recurrence: RecurrenceRule } | undefined };
    private administrators: Set<string>;
    constructor(adminIds: string[]) {
        this.settings = {};
        this.administrators = new Set(adminIds);
    }

    public addAdmin(currentUser: string, newAdmin: string) {
        if (!this.administrators.has(currentUser)) {
            throw new EntityError(EntityErrorCode.MISSING_PRIVILEGES);
        }
        this.administrators.add(newAdmin);
    }

    public removeAdmin(currentUser: string, toBeRemovedAdmin: string) {
        if (!this.administrators.has(currentUser)) {
            throw new EntityError(EntityErrorCode.MISSING_PRIVILEGES);
        }
        if (!this.administrators.has(toBeRemovedAdmin)) {
            throw new EntityError(EntityErrorCode.NO_ADMIN);
        }
        if (this.administrators.size === 1) {
            throw new EntityError(EntityErrorCode.LAST_ADMIN);
        }
        this.administrators.delete(toBeRemovedAdmin);
    }

    public setTimeFrame(key: string, settings: { frame: TimeFrame; recurrence: RecurrenceRule }, userId: string) {
        if (!this.administrators.has(userId)) {
            throw new EntityError(EntityErrorCode.MISSING_PRIVILEGES);
        }
        this.settings[key] = settings;
    }

    public getTimeFrame(key: string) {
        const timeFrame = this.settings[key];
        if (!timeFrame) {
            throw new EntityError(EntityErrorCode.TRIGGER_NOT_DEFINED);
        }
        return timeFrame;
    }

    public removeTimeFrame(key: string, userId: string) {
        if (!this.administrators.has(userId)) {
            throw new EntityError(EntityErrorCode.MISSING_PRIVILEGES);
        }
        delete this.settings[key];
    }

    public getConfig(): IChatConfig {
        const settings = Object.entries(this.settings)
            .filter(([_key, setting]) => !!setting)
            .map(([key, setting]) => {
                return {
                    key,
                    frame: setting!.frame.getConfig(),
                    recurrence: setting!.recurrence.getSettings(),
                };
            });
        return {
            settings,
            administrators: Array.from(this.administrators),
        };
    }
}
