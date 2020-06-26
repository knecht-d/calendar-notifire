import { Builder, GenericFactory } from "./creation";
import { CronTimer, LogLevels, SimpleFileStorage, TelegramChat, WebCalendar } from "./external";

(async () => {
    const _staticEvents = [
        {
            title: "Event1",
            start: new Date(2020, 4, 16, 12, 30, 0, 0),
            end: new Date(2020, 4, 16, 13, 30, 0, 0),
        },
        {
            title: "Event2",
            start: new Date(2020, 4, 16, 13, 30, 0, 0),
            end: new Date(2020, 4, 16, 14, 30, 0, 0),
        },
        {
            title: "Event3",
            start: new Date(2020, 4, 16, 14, 30, 0, 0),
            end: new Date(2020, 4, 16, 15, 30, 0, 0),
        },
        {
            title: "Event4",
            start: new Date(2020, 4, 16, 15, 30, 0, 0),
            end: new Date(2020, 4, 16, 16, 30, 0, 0),
        },
        {
            title: "Event5",
            start: new Date(2020, 4, 16, 16, 30, 0, 0),
            end: new Date(2020, 4, 16, 17, 30, 0, 0),
        },
        {
            title: "Event6",
            start: new Date(2020, 4, 16, 17, 30, 0, 0),
            end: new Date(2020, 4, 16, 18, 30, 0, 0),
        },
        {
            title: "Event7",
            start: new Date(2020, 4, 16, 18, 30, 0, 0),
            end: new Date(2020, 4, 16, 19, 30, 0, 0),
        },
        {
            title: "Event8",
            start: new Date(2020, 4, 16, 19, 30, 0, 0),
            end: new Date(2020, 4, 16, 20, 30, 0, 0),
        },
        {
            title: "Event9",
            start: new Date(2020, 4, 16, 20, 30, 0, 0),
            end: new Date(2020, 4, 16, 21, 30, 0, 0),
        },
        {
            title: "Event10",
            start: new Date(2020, 4, 16, 21, 30, 0, 0),
            end: new Date(2020, 4, 16, 22, 30, 0, 0),
        },
    ];
    _staticEvents.slice();
    // let factory = new LocalFactory();
    // const factory = new GenericFactory({
    //     calendar: WebCalendar,
    //     storage: SimpleFileStorage,
    //     chat: ConsoleChat,
    //     timer: TestSetIntervalTimer,
    // });
    const factory = new GenericFactory({
        calendar: WebCalendar,
        storage: SimpleFileStorage,
        chat: TelegramChat,
        timer: CronTimer,
    });
    const builder = new Builder(factory);
    const { chat } = await builder.build({
        calendar: {
            url: "***REMOVED***",
        },
        storage: {
            file: "data/chats.json",
        },
        chatData: {
            botToken: process.env.BOT_TOKEN || "***REMOVED***",
        },
        loggger: {
            level: LogLevels.info,
        },
    });

    await chat.start();
})().catch(console.error);
