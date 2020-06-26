import { FrameConfigBuilder } from "../../../../../../src/external/chat/telegram/conversation";
import {
    DaySelection,
    HourSelection,
    MinuteSelection,
    MonthSelection,
} from "../../../../../../src/external/chat/telegram/conversation/frameSelectors";
import { MockLogger } from "../../../../../mocks/external/MockLogger";

jest.mock("../../../../../../src/external/chat/telegram/conversation/frameSelectors");
describe("FrameConfigBuilder", () => {
    const mockLogger = new MockLogger();
    const mockEditMessage = jest.fn(() => Promise.resolve());

    describe("init", () => {
        let originalButtonPress: any;
        beforeEach(() => {
            originalButtonPress = FrameConfigBuilder.handleButtonPress;
            FrameConfigBuilder.handleButtonPress = jest.fn();
            jest.spyOn(MonthSelection, "setActions").mockImplementation((_bot, handler) => handler({} as any, "Month"));
            jest.spyOn(DaySelection, "setActions").mockImplementation((_bot, handler) => handler({} as any, "Day"));
            jest.spyOn(MinuteSelection, "setActions").mockImplementation((_bot, handler) =>
                handler({} as any, "Minute"),
            );
            jest.spyOn(HourSelection, "setActions").mockImplementation((_bot, handler) => handler({} as any, "Hour"));
        });
        afterEach(() => {
            FrameConfigBuilder.handleButtonPress = originalButtonPress;
        });
        it("should set the Actions of all selections", () => {
            const mockBot = { mock: "bot" };

            FrameConfigBuilder.init(mockBot as any, mockLogger);

            expect(MonthSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(FrameConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Month");

            expect(DaySelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(FrameConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Day");

            expect(MinuteSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(FrameConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Minute");

            expect(HourSelection.setActions).toHaveBeenCalledWith(mockBot, expect.any(Function));
            expect(FrameConfigBuilder.handleButtonPress).toHaveBeenCalledWith({}, "Hour");
        });
    });

    describe("handleButtonPress", () => {
        it("should call the resolver of the builder with the respective message id", () => {
            const mockCtx = {
                editMessageText: jest.fn(),
                // eslint-disable-next-line @typescript-eslint/camelcase
                callbackQuery: { message: { message_id: 42 } },
            };
            const builder = new FrameConfigBuilder(42, mockEditMessage);
            jest.spyOn(builder, "currentResolver");

            FrameConfigBuilder.handleButtonPress(mockCtx as any, "some");
            expect(builder.currentResolver).toHaveBeenCalledWith("some");
        });
    });

    describe("requestConfig", () => {
        beforeAll(() => {
            jest.spyOn(MonthSelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.month = true;
                    return config;
                }),
            );
            jest.spyOn(DaySelection.prototype, "requestInput").mockImplementation((config: any) =>
                Promise.resolve((_selection: any) => {
                    config.day = true;
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
        it("should request month, day and hour for monthly reccurrence", async () => {
            const config = { type: "m" as "m" };
            const builder = new FrameConfigBuilder(42, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver(""), 10);

            const result = await builder.requestConfig(config);

            clearInterval(interval);
            expect(result).toEqual({
                month: true,
                day: true,
                hour: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
        it("should request day, hour and minute for daily reccurrence", async () => {
            const config = { type: "d" as "d" };
            const builder = new FrameConfigBuilder(43, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver(""), 10);

            const result = await builder.requestConfig(config);

            clearInterval(interval);
            expect(result).toEqual({
                day: true,
                hour: true,
                minute: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
        it("should request hour and minute for hourly reccurrence", async () => {
            const config = { type: "h" as "h" };
            const builder = new FrameConfigBuilder(44, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver(""), 10);

            const result = await builder.requestConfig(config);

            clearInterval(interval);
            expect(result).toEqual({
                hour: true,
                minute: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
        it("should request month, day, hour and minute as a default", async () => {
            const config = {};
            const builder = new FrameConfigBuilder(43, mockEditMessage);
            const interval = setInterval(() => builder.currentResolver(""), 10);

            const result = await builder.requestConfig(config);

            clearInterval(interval);
            expect(result).toEqual({
                month: true,
                day: true,
                hour: true,
                minute: true,
            });
            expect(builder.getConfig()).toEqual(result);
        });
    });
});
