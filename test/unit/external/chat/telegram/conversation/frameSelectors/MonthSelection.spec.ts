import { Extra, Markup } from "telegraf";
import { MonthSelection } from "../../../../../../../src/external/chat/telegram/conversation/frameSelectors";

describe("MonthSelection", () => {
    const values = ["+1", "+2", "+3"];
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
            MonthSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`FRAME_MONTH|${value}`, expect.any(Function));
        });

        it.each([...values, skip])("should set the correct handler for %s", value => {
            const mockSelectionHandler = jest.fn();
            MonthSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(mockSelectionHandler).toHaveBeenCalledWith(mockCtx, value);
        });
    });

    describe("requestInput", () => {
        it("should send the question", async () => {
            const selection = new MonthSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("Bis zu welchem Monat"),
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

            const selection = new MonthSelection(mockEditMessage, 42);
            await selection.requestInput({});

            expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot();
        });

        it.each(values)("should set the month on selection of %s", async value => {
            const selection = new MonthSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(value);
            expect(result).toEqual({
                month: {
                    fixed: false,
                    value: values.indexOf(value) + 1,
                },
            });
        });

        it("should not set the month on selection of SKIP", async () => {
            const selection = new MonthSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(skip);
            expect(result).toEqual({});
        });
    });
});
