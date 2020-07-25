import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { IGenericFrame, IGenericRecurrence } from "../../../../gateways";
import { ILogger } from "../../../logging";
import { AbstractSelection } from "./AbstractSelection";
import { DaySelection, HourSelection, MinuteSelection, MonthSelection } from "./frameSelectors";
import { handleButtonPress } from "./utils";

export class FrameConfigBuilder {
    private static ALL_BUILDER: { [messageId: number]: FrameConfigBuilder } = {};
    private static LOGGER: ILogger;
    config: IGenericFrame;
    currentResolver: (selection: string) => void;

    constructor(
        private messageId: number,
        private editMessage: (text: string, extra?: ExtraReplyMessage) => Promise<void>,
    ) {
        this.config = {};
        this.currentResolver = () => {
            return;
        };
        FrameConfigBuilder.ALL_BUILDER[messageId] = this;
    }

    static init(bot: Telegraf<TelegrafContext>, logger: ILogger) {
        this.LOGGER = logger;
        [MonthSelection, DaySelection, MinuteSelection, HourSelection].forEach(selection => {
            selection.setActions(bot, this.handleButtonPress.bind(this));
        });
    }

    static handleButtonPress(ctx: TelegrafContext, selection: string) {
        handleButtonPress(this.ALL_BUILDER, this.LOGGER, ctx, selection);
    }

    async requestConfig(recurrence: IGenericRecurrence) {
        switch (recurrence.type) {
            case "m":
                await this.requestSelection(MonthSelection);
                await this.requestSelection(DaySelection);
                await this.requestSelection(HourSelection);
                break;
            case "d":
                await this.requestSelection(DaySelection);
                await this.requestSelection(HourSelection);
                await this.requestSelection(MinuteSelection);
                break;
            case "h":
                await this.requestSelection(HourSelection);
                await this.requestSelection(MinuteSelection);
                break;
            default:
                throw new Error("Unexpected Recurrence Type");
        }

        delete FrameConfigBuilder.ALL_BUILDER[this.messageId];
        return this.config;
    }

    getConfig() {
        return this.config;
    }

    private async requestSelection(
        Selection: new (
            editMessage: (text: string, extra?: ExtraReplyMessage) => Promise<void>,
            messageId: number,
        ) => AbstractSelection<IGenericFrame>,
    ) {
        const selection = new Selection(this.editMessage, this.messageId);
        const selectionHandler = await selection.requestInput(this.config);
        return new Promise<void>(res => {
            this.currentResolver = selection => {
                this.config = selectionHandler(selection);
                res();
            };
        });
    }
}
