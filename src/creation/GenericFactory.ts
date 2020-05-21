import { AbstractCalendar, AbstractChat, AbstractStorage, AbstractTimer, ILogger } from "../external";

export class GenericFactory<CalendarSetup, StorageSetup, ChatSetup> {
    constructor(
        protected classes: {
            calendar: new (logger: ILogger, setupData: CalendarSetup) => AbstractCalendar<CalendarSetup>;
            storage: new (logger: ILogger, setupData: StorageSetup) => AbstractStorage<StorageSetup>;
            chat: new (logger: ILogger, setupData: ChatSetup) => AbstractChat<ChatSetup>;
            timer: new (logger: ILogger) => AbstractTimer;
        },
    ) {}
    createCalendar(logger: ILogger, setupData: CalendarSetup): AbstractCalendar<CalendarSetup> {
        return new this.classes.calendar(logger, setupData);
    }
    createChat(logger: ILogger, setupData: ChatSetup): AbstractChat<ChatSetup> {
        return new this.classes.chat(logger, setupData);
    }
    createStorage(logger: ILogger, setupData: StorageSetup): AbstractStorage<StorageSetup> {
        return new this.classes.storage(logger, setupData);
    }
    createTimer(logger: ILogger): AbstractTimer {
        return new this.classes.timer(logger);
    }
}
