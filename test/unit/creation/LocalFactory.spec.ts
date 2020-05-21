import { LocalFactory } from "../../../src/creation";
import { ConsoleChat, SimpleFileStorage, StaticCalendar, TestSetIntervalTimer } from "../../../src/external";
import { MockLogger } from "../../mocks/external/MockLogger";

jest.mock("../../../src/external");
describe("LocalFactory", () => {
    describe("should create instances of external modules for local development", () => {
        const mockLogger = new MockLogger();
        it("calendar", () => {
            const factory = new LocalFactory();
            const calendar = factory.createCalendar(mockLogger, { events: [] });
            expect(calendar).toBeInstanceOf(StaticCalendar);
        });
        it("chat", () => {
            const factory = new LocalFactory();
            const chat = factory.createChat(mockLogger, { chatId: "chat", userId: "user" });
            expect(chat).toBeInstanceOf(ConsoleChat);
        });
        it("storage", () => {
            const factory = new LocalFactory();
            const storage = factory.createStorage(mockLogger, { file: "someFile" });
            expect(storage).toBeInstanceOf(SimpleFileStorage);
        });
        it("timer", () => {
            const factory = new LocalFactory();
            const timer = factory.createTimer(mockLogger);
            expect(timer).toBeInstanceOf(TestSetIntervalTimer);
        });
    });
});
