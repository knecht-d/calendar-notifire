import { TimeFrame } from "./TimeFrame";
import { ITimeFrameSettings, IRecurrenceRule } from "../interfaces";

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
        return {
            timeFrames: this.timeFrames,
        };
    }
}
