import { Extra, Markup } from "telegraf";
import { ToHourSelection } from "../../../../../../../src/external/chat/telegram/conversation/triggerSelectors";

describe("ToHourSelection", () => {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
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
            ToHourSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`TRIGGER_TO_HOUR-${value}`, expect.any(Function));
        });

        it.each([...values])("should set the correct handler for %s", value => {
            const mockSelectionHandler = jest.fn();
            ToHourSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(mockSelectionHandler).toHaveBeenCalledWith(mockCtx, `${value}`);
        });
    });

    describe("requestInput", () => {
        it("should send the question for other typed", async () => {
            const selection = new ToHourSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("Bis zu welcher Stunde"),
                expect.any(Object),
            );
        });

        describe("keyboard", () => {
            let selection: ToHourSelection;
            beforeAll(() => {
                jest.spyOn(Extra, "markup").mockImplementation((): any => {
                    return {
                        markup: (cb: () => any) => cb(),
                    };
                });
                jest.spyOn(Markup, "callbackButton").mockImplementation(
                    (desc: string, key: string): any => `${desc}(${key})`,
                );
                jest.spyOn(Markup, "inlineKeyboard");

                selection = new ToHourSelection(mockEditMessage, 42);
            });
            it.each([...values])("should have only values >= %s", async value => {
                await selection.requestInput({ hour: value });

                expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot();
            });
        });

        it.each(values)("should set the day on selection of %s", async value => {
            const selection = new ToHourSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(`${value}`);
            expect(result).toEqual({
                hourEnd: value,
            });
        });
    });
});
