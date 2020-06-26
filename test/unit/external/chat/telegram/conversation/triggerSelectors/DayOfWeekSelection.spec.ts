import { Extra, Markup } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { DayOfWeekSelection } from "../../../../../../../src/external/chat/telegram/conversation/triggerSelectors";

describe("DayOfWeekSelection", () => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const done = "DONE";
    const MockBot = {
        action: jest.fn((_, _handler) => {
            // handler(mockCtx);
        }),
    };
    const mockEditMessage = jest.fn(() => Promise.resolve());

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Extra, "markup").mockImplementation((): any => {
            return {
                markup: (cb: () => any) => cb(),
            };
        });
        jest.spyOn(Markup, "callbackButton").mockImplementation((desc: string, key: string): any => `${desc}(${key})`);
        jest.spyOn(Markup, "inlineKeyboard");
    });

    describe("setActions", () => {
        it.each([...days, done])("should set action for %s", value => {
            const mockSelectionHandler = jest.fn();
            DayOfWeekSelection.setActions(MockBot as any, mockSelectionHandler);
            expect(MockBot.action).toHaveBeenCalledWith(`TRIGGER_DAYS_OF_WEEK-${value}`, expect.any(Function));
        });
    });

    describe("handler", () => {
        const mockCtx = {
            editMessageText: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/camelcase
            callbackQuery: { message: { message_id: 42 } },
        };
        const handlers: { [key: string]: (ctx: TelegrafContext) => void } = {};
        let selection: DayOfWeekSelection;
        beforeEach(() => {
            MockBot.action.mockImplementation((key: string, handler: (ctx: TelegrafContext) => void) => {
                handlers[key] = handler;
            });
            const mockSelectionHandler = jest.fn();
            DayOfWeekSelection.setActions(MockBot as any, mockSelectionHandler);
        });

        it.each([
            "TRIGGER_DAYS_OF_WEEK-monday",
            "TRIGGER_DAYS_OF_WEEK-tuesday",
            "TRIGGER_DAYS_OF_WEEK-wednesday",
            "TRIGGER_DAYS_OF_WEEK-thursday",
            "TRIGGER_DAYS_OF_WEEK-friday",
            "TRIGGER_DAYS_OF_WEEK-saturday",
            "TRIGGER_DAYS_OF_WEEK-sunday",
        ])("should handle %s", triggerKey => {
            selection = new DayOfWeekSelection(mockEditMessage, 42);
            handlers[triggerKey](mockCtx as any);

            expect((selection as any).daysOfWeek).toMatchSnapshot("daysofweek");
            expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot("keyboard");
        });
    });

    describe("requestInput", () => {
        it("should send the question for type Hourly", async () => {
            const selection = new DayOfWeekSelection(mockEditMessage, 42);
            await selection.requestInput({});
            expect(mockEditMessage).toHaveBeenCalledWith(
                expect.stringContaining("An welchen Tagen"),
                expect.any(Object),
            );
        });

        it("should have the correct keyboard", async () => {
            const selection = new DayOfWeekSelection(mockEditMessage, 42);
            await selection.requestInput({});

            expect((Markup.inlineKeyboard as jest.Mock).mock.calls).toMatchSnapshot();
        });

        it("should return the days on selection of DONE", async () => {
            const selection = new DayOfWeekSelection(mockEditMessage, 42);
            const handler = await selection.requestInput({});
            (selection as any).daysOfWeek = {
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: true,
                saturday: false,
                sunday: true,
            };
            const result = handler("");
            expect(result).toEqual({
                daysOfWeek: {
                    monday: true,
                    tuesday: false,
                    wednesday: true,
                    thursday: false,
                    friday: true,
                    saturday: false,
                    sunday: true,
                },
            });
        });
    });
});
