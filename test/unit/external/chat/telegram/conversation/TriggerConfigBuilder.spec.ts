import { TriggerConfigBuilder } from "../../../../../../src/external/chat/telegram/conversation";
import {
    DayOfMonthSelection,
    DayOfWeekSelection,
    HourSelection,
    MinuteSelection,
    RecurrenceTypeSelection,
    ToHourSelection,
} from "../../../../../../src/external/chat/telegram/conversation/triggerSelectors";
import { MockLogger } from "../../../../../mocks/external/MockLogger";

jest.mock("../../../../../../src/external/chat/telegram/conversation/triggerSelectors");
describe("TriggerConfigBuilder", () => {
    const mockLogger = new MockLogger();
    const mockEditMessage = jest.fn(() => Promise.resolve());

    describe("init", () => {
        let originalButtonPress: any;
        beforeEach(() => {
            originalButtonPress = TriggerConfigBuilder.handleButtonPress;
            TriggerConfigBuilder.handleButtonPress = jest.fn();
            jest.spyOn(RecurrenceTypeSelection, "setActions").mockImplementation((_bot, handler) =>
                handler({} as any, "Type"),
            );
            jest.spyOn(DayOfMonthSelection, "setActions").mockImplementation((_bot, handler) =>
                handler({} as any, "DayOfMonth"),
            );
            jest.spyOn(DayOfWeekSelection, "setActions").mockImplementation((_bot, handler) =>
                handler({} as any, "DayOfWeek"),
            );
            jest.spyOn(HourSelection, "setActions").mockImplementation((_bot, handler) => handler({} as any, "Hour"));
            jest.spyOn(ToHourSelection, "setActions").mockImplementation((_bot, handler) =>
                handler({} as any, "ToHour"),
            );
            jest.spyOn(MinuteSelection, "setActions").mockImplementation((_bot, handler) =>
                handler({} as any, "Minute"),
            );
        });
        afterEach(() => {
            TriggerConfigBuilder.handleButtonPress = originalButtonPress;
        });
        it("should set the Actions of all selections", () => {
            const mockBot = { mock: "bot" };

            TriggerConfigBuilder.init(mockBot as any, mockLogger);

            expect(RecurrenceTypeSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(TriggerConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Type");

            expect(DayOfMonthSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(TriggerConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "DayOfMonth");

            expect(DayOfWeekSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(TriggerConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "DayOfWeek");

            expect(HourSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(TriggerConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Hour");

            expect(ToHourSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(TriggerConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "ToHour");

            expect(MinuteSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(TriggerConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Minute");
        });
    });

    describe("handleButtonPress", () => {
        it("should call the resolver of the builder with the respective message id", () => {
            const mockCtx = {
                editMessageText: jest.fn(),
                // eslint-disable-next-line @typescript-eslint/camelcase
                callbackQuery: { message: { message_id: 42 } },
            };
            const builder = new TriggerConfigBuilder(42, mockEditMessage);
            jest.spyOn(builder, "currentResolver");

            TriggerConfigBuilder.handleButtonPress(mockCtx as any, "some");
            expect(builder.currentResolver).toHaveBeenCalledWith("some");
        });
    });

    describe("requestConfig", () => {
        beforeAll(() => {
            jest.spyOn(RecurrenceTypeSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((selection: any) => {
                    config.type = selection;
                    return config;
                }),
            );
            jest.spyOn(DayOfMonthSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.dayOfMonth = true;
                    return config;
                }),
            );
            jest.spyOn(DayOfWeekSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.dayOfWeek = true;
                    return config;
                }),
            );
            jest.spyOn(ToHourSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.toHour = true;
                    return config;
                }),
            );
            jest.spyOn(HourSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.hour = true;
                    return config;
                }),
            );
            jest.spyOn(MinuteSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.minute = true;
                    return config;
                }),
            );
        });
        it("should request type, day of month, hour and minute for monthly reccurrence", async () => {
            const builder = new TriggerConfigBuilder(42, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver("m"), 10);

            const result = await builder.requestConfig();

            clearInterval(interval);
            expect(result).toEqual({
                type: "m",
                dayOfMonth: true,
                hour: true,
                minute: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
        it("should request type, day of week, hour and minute for daily reccurrence", async () => {
            const builder = new TriggerConfigBuilder(42, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver("d"), 10);

            const result = await builder.requestConfig();

            clearInterval(interval);
            expect(result).toEqual({
                type: "d",
                dayOfWeek: true,
                hour: true,
                minute: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
        it("should request type, day of week, hour, toHour and minute for hourly reccurrence", async () => {
            const builder = new TriggerConfigBuilder(42, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver("h"), 10);

            const result = await builder.requestConfig();

            clearInterval(interval);
            expect(result).toEqual({
                type: "h",
                dayOfWeek: true,
                hour: true,
                toHour: true,
                minute: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
    });
});
