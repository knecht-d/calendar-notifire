import { Extra, Markup } from "telegraf";
import { RecurrenceTypeSelection } from "../../../../../../../src/external/chat/telegram/conversation/triggerSelectors";

describe("RecurrenceTypeSelection", () => {
    const values = ["h", "d", "m"];
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
            RecurrenceTypeSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`TRIGGER_REC_TYPE-${value}`, expect.any(Function));
        });

        it.each([...values])("should set the correct handler for %s", value => {
            const mockSelectionHandler = jest.fn();
            RecurrenceTypeSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(mockSelectionHandler).toHaveBeenCalledWith(mockCtx, `${value}`);
        });
    });

    describe("requestInput", () => {
        it("should send the question", async () => {
            const selection = new RecurrenceTypeSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("Wie häufig soll die Erinnerung geprüft werden?"),
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

            const selection = new RecurrenceTypeSelection(mockEditMessage, 42);
            await selection.requestInput({});

            expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot();
        });

        it.each(values)("should set the day on selection of %s", async value => {
            const selection = new RecurrenceTypeSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            const result = handler(`${value}`);
            expect(result).toEqual({
                type: value,
            });
        });
    });
});
