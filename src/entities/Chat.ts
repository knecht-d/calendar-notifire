import { TimeFrame } from "./TimeFrame";
import { ITimeFrameSettings, IRecurrenceRule, ITimeFrameJSON } from "../interfaces";
import { EntityError, EntityErrorCode } from "./EntityError";

export class Chat {
    private timeFrames: { [frameId: string]: TimeFrame | undefined };
    private administrators: string[];
    constructor(adminIds: string[]) {
        this.timeFrames = {};
        this.administrators = adminIds;
    }

    public setTimeFrame(
        key: string,
        settings: { begin?: ITimeFrameSettings; end?: ITimeFrameSettings; recurrence: IRecurrenceRule },
        userId: string,
    ) {
        if (!this.administrators.includes(userId)) {
            throw new EntityError(EntityErrorCode.MISSING_PRIVILEGES);
        }
        this.timeFrames[key] = new TimeFrame(settings.begin || {}, settings.end || {}, settings.recurrence);
    }

    public getTimeFrame(key: string) {
        return this.timeFrames[key];
    }

    public toJSON() {
        const timeFrames = Object.entries(this.timeFrames)
            .filter(([_, value]) => !!value)
            .map(([key, value]) => ({ key, value: value!.toJSON() }))
            .reduce((map, { key, value }) => {
                map[key] = value;
                return map;
            }, {} as { [frameId: string]: ITimeFrameJSON });
        return {
            timeFrames,
            administrators: this.administrators,
        };
    }
}
