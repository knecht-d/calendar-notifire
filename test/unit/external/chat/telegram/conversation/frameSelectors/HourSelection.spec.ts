import { Extra, Markup } from "telegraf";
import { HourSelection } from "../../../../../../../src/external/chat/telegram/conversation/frameSelectors";

describe("HourSelection", () => {
    const fixedValues = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
    ];
    const relativeValues = ["+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "+10", "+11", "+12"];
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
            HourSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`FRAME_HOUR|${value}`, expect.any(Function));
        });

        it.each([...values, skip])("should set the correct handler for %s", value => {
            const mockSelectionHandler = jest.fn();
            HourSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(mockSelectionHandler).toHaveBeenCalledWith(mockCtx, value);
        });
    });

    describe("requestInput", () => {
        it("should send the question", async () => {
            const selection = new HourSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("Bis zu welcher Stunde "),
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

            const selection = new HourSelection(mockEditMessage, 42);
            await selection.requestInput({});

            expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot();
        });

        it.each(fixedValues)("should set the fixed hour on selection of %s", async value => {
            const selection = new HourSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(value);
            expect(result).toEqual({
                hour: {
                    fixed: true,
                    value: fixedValues.indexOf(value),
                },
            });
        });

        it.each(relativeValues)("should set the relative hour on selection of %s", async value => {
            const selection = new HourSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(value);
            expect(result).toEqual({
                hour: {
                    fixed: false,
                    value: relativeValues.indexOf(value) + 1,
                },
            });
        });

        it("should not set the hour on selection of SKIP", async () => {
            const selection = new HourSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(skip);
            expect(result).toEqual({});
        });
    });
});
