import { TimeFrame, ITimeFrameSettings } from "./TimeFrame";

export class Chat {
    private timeFrames: Map<string, TimeFrame>;
    constructor(private chatId: string) {
        this.timeFrames = new Map();
    }

    public addTimeFrame(key: string, settings: { begin?: ITimeFrameSettings; end?: ITimeFrameSettings }) {
        this.timeFrames.set(key, new TimeFrame(settings.begin || {}, settings.end || {}));
    }

    public getTimeFrame(key: string) {
        return this.timeFrames.get(key);
    }

    public get id(): string {
        return this.chatId;
    }
}
