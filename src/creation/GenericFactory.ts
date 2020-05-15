import { AbstractCalendar, AbstractChat, AbstractStorage, AbstractTimer } from "../external";

export abstract class GenericFactory<CalendarSetup, StorageSetup, ChatSetup> {
    constructor(
        protected classes: {
            calendar: new (setupData: CalendarSetup) => AbstractCalendar<CalendarSetup>;
            storage: new (setupData: StorageSetup) => AbstractStorage<StorageSetup>;
            chat: new (setupData: ChatSetup) => AbstractChat<ChatSetup>;
            timer: new () => AbstractTimer;
        },
    ) {}
    createCalendar(setupData: CalendarSetup): AbstractCalendar<CalendarSetup> {
        return new this.classes.calendar(setupData);
    }
    createChat(setupData: ChatSetup): AbstractChat<ChatSetup> {
        return new this.classes.chat(setupData);
    }
    createStorage(setupData: StorageSetup): AbstractStorage<StorageSetup> {
        return new this.classes.storage(setupData);
    }
    createTimer(): AbstractTimer {
        return new this.classes.timer();
    }
}
