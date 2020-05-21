import { LocalFactory } from "../../../src/creation";
import { ConsoleChat, SimpleFileStorage, StaticCalendar, TestSetIntervalTimer } from "../../../src/external";

jest.mock("../../../src/external");
describe("LocalFactory", () => {
    describe("should create instances of external modules for local development", () => {
        it("calendar", () => {
            const factory = new LocalFactory();
            const calendar = factory.createCalendar({ events: [] });
            expect(calendar).toBeInstanceOf(StaticCalendar);
        });
        it("chat", () => {
            const factory = new LocalFactory();
            const chat = factory.createChat({ chatId: "chat", userId: "user" });
            expect(chat).toBeInstanceOf(ConsoleChat);
        });
        it("storage", () => {
            const factory = new LocalFactory();
            const storage = factory.createStorage({ file: "someFile" });
            expect(storage).toBeInstanceOf(SimpleFileStorage);
        });
        it("timer", () => {
            const factory = new LocalFactory();
            const timer = factory.createTimer();
            expect(timer).toBeInstanceOf(TestSetIntervalTimer);
        });
    });
});
