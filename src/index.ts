import { existsSync, readFileSync } from "fs";
import { Builder, GenericFactory } from "./creation";
import {
    AbstractChat,
    ConsoleChat,
    CronTimer,
    LogLevels,
    SimpleFileStorage,
    TelegramChat,
    WebCalendar,
} from "./external";

function toLogLevel(input: string): LogLevels {
    const map: { [input: string]: LogLevels } = {
        error: LogLevels.error,
        warn: LogLevels.warn,
        info: LogLevels.info,
        verbose: LogLevels.verbose,
        debug: LogLevels.debug,
    };
    return map[input];
}

(async () => {
    const setupFile = `${__dirname}/../data/setup.json`;
    if (!existsSync(setupFile)) {
        console.error(`Missing ${setupFile}`);
        return;
    }

    const rawData = readFileSync(setupFile, { encoding: "utf8" });
    const setupData = JSON.parse(rawData);

    if (!setupData.calendarURL) {
        console.error(`Missing calendarURL in ${setupFile}`);
        return;
    }

    let chat: AbstractChat<unknown>;
    if (setupData.telegram) {
        const factory = new GenericFactory({
            calendar: WebCalendar,
            storage: SimpleFileStorage,
            chat: TelegramChat,
            timer: CronTimer,
        });
        const builder = new Builder(factory);
        chat = (
            await builder.build({
                calendar: {
                    url: setupData.calendarURL,
                },
                storage: {
                    file: setupData.chatConfig || "data/chats.json",
                },
                chatData: {
                    botToken: setupData.telegram,
                },
                loggger: {
                    level: toLogLevel(setupData.logLevel) ?? LogLevels.info,
                },
            })
        ).chat;
    } else {
        const factory = new GenericFactory({
            calendar: WebCalendar,
            storage: SimpleFileStorage,
            chat: ConsoleChat,
            timer: CronTimer,
        });
        const builder = new Builder(factory);
        chat = (
            await builder.build({
                calendar: {
                    url: setupData.calendarURL,
                },
                storage: {
                    file: setupData.chatConfig || "data/chats.json",
                },
                chatData: {
                    chatId: "Console",
                    userId: "ConsoleUser",
                },
                loggger: {
                    level: toLogLevel(setupData.logLevel) ?? LogLevels.info,
                },
            })
        ).chat;
    }

    await chat.start();
})().catch(console.error);
