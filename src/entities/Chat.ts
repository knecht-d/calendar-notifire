import { TimeFrame } from "./TimeFrame";
import { ITimeFrameSettings, IRecurrenceRule, ITimeFrameJSON } from "../interfaces";

export class Chat {
    private timeFrames: { [frameId: string]: TimeFrame | undefined };
    constructor() {
        this.timeFrames = {};
    }

    public setTimeFrame(
        key: string,
        settings: { begin?: ITimeFrameSettings; end?: ITimeFrameSettings; recurrence: IRecurrenceRule },
    ) {
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
        };
    }
}
