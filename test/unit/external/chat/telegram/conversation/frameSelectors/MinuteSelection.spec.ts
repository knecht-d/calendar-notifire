import { Extra, Markup } from "telegraf";
import { MinuteSelection } from "../../../../../../../src/external/chat/telegram/conversation/frameSelectors";

describe("MinuteSelection", () => {
    const fixedValues = ["0", "15", "30", "45", "59"];
    const relativeValues = ["+15", "+30", "+45"];
    const values = [...fixedValues, ...relativeValues];
    const skip = "SKIP";
    const mockCtx = { mock: "ctx" };
    const MockBot = {
        action: jest.fn((_, handler) => {
            handler(mockCtx);
        }),
    };
    const mockEditMessage = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    describe("setActions", () => {
        it.each([...values, skip])("should set action for %s", value => {
            const mockSelectionHandler = jest.fn();
            MinuteSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`FRAME_MINUTE|${value}`, expect.any(Function));
        });

        it.each([...values, skip])("should set the correct handler for %s", value => {
            const mockSelectionHandler = jest.fn();
            MinuteSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(mockSelectionHandler).toHaveBeenCalledWith(mockCtx, value);
        });
    });

    describe("requestInput", () => {
        it("should send the question", async () => {
            const selection = new MinuteSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("Bis zu welcher Minute"),
                expect.any(Object),
            );
        });

        it("should have the correct keyboard", async () => {
            jest.spyOn(Extra, "markup").mockImplementation((): any => {
                return {
                    markup: (cb: () => any) => cb(),
                };
            });
            jest.spyOn(Markup, "callbackButton").mockImplementation(
                (desc: string, key: string): any => `${desc}(${key})`,
            );
            jest.spyOn(Markup, "inlineKeyboard");

            const selection = new MinuteSelection(mockEditMessage, 42);
            await selection.requestInput({});

            expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot();
        });

        it.each(fixedValues)("should set the fixed minute on selection of %s", async value => {
            const selection = new MinuteSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(value);
            expect(result).toEqual({
                minute: {
                    fixed: true,
                    value: Number.parseInt(value),
                },
            });
        });

        it.each(relativeValues)("should set the relative minute on selection of %s", async value => {
            const selection = new MinuteSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(value);
            expect(result).toEqual({
                minute: {
                    fixed: false,
                    value: Number.parseInt(value),
                },
            });
        });

        it("should not set the hour on selection of SKIP", async () => {
            const selection = new MinuteSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(skip);
            expect(result).toEqual({});
        });
    });
});
