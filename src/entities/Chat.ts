import { ITimeFrameSettings } from "../interfaces";
import { EntityError, EntityErrorCode } from "./EntityError";
import { IRecurrenceSettings, RecurrenceRule } from "./RecurrenceRule";
import { TimeFrame } from "./TimeFrame";

export class Chat {
    private settings: { [frameId: string]: { frame: TimeFrame; recurrence: RecurrenceRule } | undefined };
    private administrators: string[];
    constructor(adminIds: string[]) {
        this.settings = {};
        this.administrators = adminIds;
    }

    public setTimeFrame(key: string, settings: { frame: TimeFrame; recurrence: RecurrenceRule }, userId: string) {
        if (!this.administrators.includes(userId)) {
            throw new EntityError(EntityErrorCode.MISSING_PRIVILEGES);
        }
        this.settings[key] = settings;
    }

    public getTimeFrame(key: string) {
        return this.settings[key];
    }

    public removeTimeFrame(key: string, userId: string) {
        if (!this.administrators.includes(userId)) {
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
                    frame: setting!.frame.toJSON(),
                    recurrence: setting!.recurrence.getSettings(),
                };
            });
        return {
            settings,
            administrators: this.administrators,
        };
    }
}

export interface IChatConfig {
    administrators: string[];
    settings: Array<{
        key: string;
        frame: {
            begin: ITimeFrameSettings;
            end: ITimeFrameSettings;
        };
        recurrence: IRecurrenceSettings;
    }>;
}
