import { Extra, Markup } from "telegraf";
import { MinuteSelection } from "../../../../../../../src/external/chat/telegram/conversation/triggerSelectors";

describe("MinuteSelection", () => {
    const values = [0, 10, 15, 20, 30, 40, 45, 50];
    const mockCtx = { mock: "ctx" };
    const MockBot = {
        action: jest.fn((_, handler) => {
            handler(mockCtx);
        }),
    };
    const mockEditMessage = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    describe("setActions", () => {
        it.each([...values])("should set action for %s", value => {
            const mockSelectionHandler = jest.fn();
            MinuteSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`TRIGGER_MINUTE-${value}`, expect.any(Function));
        });

        it.each([...values])("should set the correct handler for %s", value => {
            const mockSelectionHandler = jest.fn();
            MinuteSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(mockSelectionHandler).toHaveBeenCalledWith(mockCtx, `${value}`);
        });
    });

    describe("requestInput", () => {
        it("should send the question", async () => {
            const selection = new MinuteSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("Zu welcher Minute"),
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

        it.each(values)("should set the day on selection of %s", async value => {
            const selection = new MinuteSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(`${value}`);
            expect(result).toEqual({
                minute: value,
            });
        });
    });
});
