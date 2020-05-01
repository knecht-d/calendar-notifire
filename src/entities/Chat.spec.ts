import { Chat } from "./Chat";
import { ITimeFrameSettings, TimeFrame } from "./TimeFrame";

describe("Chat", () => {
    it("id should be immuteable", () => {
        const chat = new Chat("id");
        let id = chat.id;
        id += "test";
        expect(id).not.toEqual((chat as any).chatId);
    });

    describe("TimeFrames", () => {
        it("should set and return the time frame", () => {
            const chat = new Chat("chatId");
            chat.addTimeFrame("tf", {});
            const tf = chat.getTimeFrame("tf");
            expect(tf).toBeDefined();
        });
        it("should return undefined for not exisiting timeframes", () => {
            const chat = new Chat("chatId");
            chat.addTimeFrame("tf", {});
            const tf = chat.getTimeFrame("notDefined");
            expect(tf).not.toBeDefined();
        });
        it("should create the correct TimeFrame", () => {
            const chat = new Chat("chatId");
            const tfBegin: ITimeFrameSettings = {
                minute: { value: -1 },
                hour: { value: -1 },
                day: { value: -1 },
                month: { value: -1 },
                year: { value: -1 },
            };
            const tfEnd: ITimeFrameSettings = {
                minute: { value: 2 },
                hour: { value: 2 },
                day: { value: 2 },
                month: { value: 2 },
                year: { value: 2 },
            };
            const tf2Begin: ITimeFrameSettings = {
                minute: { value: 30 },
                hour: { value: 12 },
                day: { value: 2 },
                month: { value: 1 },
                year: { value: 2020 },
            };
            const tf2End: ITimeFrameSettings = {
                minute: { value: 40 },
                hour: { value: 13 },
                day: { value: 3 },
                month: { value: 8 },
                year: { value: 2020 },
            };
            const tf = new TimeFrame(tfBegin, tfEnd);
            const tf2 = new TimeFrame(tf2Begin, tf2End);

            chat.addTimeFrame("tf", { begin: tfBegin, end: tfEnd });
            chat.addTimeFrame("tf2", { begin: tf2Begin, end: tf2End });

            const actualTf = chat.getTimeFrame("tf");
            const actualTf2 = chat.getTimeFrame("tf2");
            const date = new Date(2020, 8, 13, 18, 45, 17, 30);
            expect(actualTf?.getStart(date)).toEqual(tf.getStart(date));
            expect(actualTf?.getEnd(date)).toEqual(tf.getEnd(date));
            expect(actualTf2?.getStart(date)).toEqual(tf2.getStart(date));
            expect(actualTf2?.getEnd(date)).toEqual(tf2.getEnd(date));
        });
        it("should use empty settings as defaults", () => {
            const chat = new Chat("chatId");

            chat.addTimeFrame("tf", {});

            const actualTf = chat.getTimeFrame("tf");
            const date = new Date(2020, 8, 13, 18, 45, 17, 30);
            expect(actualTf?.getStart(date)).toEqual(new Date(2020, 8, 13, 18, 45));
            expect(actualTf?.getEnd(date)).toEqual(new Date(2020, 8, 13, 18, 45));
        });
    });
});