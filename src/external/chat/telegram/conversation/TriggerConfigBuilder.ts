import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { IGenericRecurrence } from "../../../../gateways";
import { ILogger } from "../../../logging";
import { AbstractSelection } from "./AbstractSelection";
import {
    DayOfMonthSelection,
    DayOfWeekSelection,
    HourSelection,
    MinuteSelection,
    RecurrenceTypeSelection,
    ToHourSelection,
} from "./triggerSelectors";
import { handleButtonPress } from "./utils";

export class TriggerConfigBuilder {
    private static ALL_BUILDER: { [messageId: number]: TriggerConfigBuilder } = {};
    private static LOGGER: ILogger;
    config: IGenericRecurrence;
    currentResolver: (selection: string) => void;

    constructor(
        private messageId: number,
        private editMessage: (text: string, extra?: ExtraReplyMessage) => Promise<void>,
    ) {
        this.config = {};
        this.currentResolver = () => {
            return;
        };
        TriggerConfigBuilder.ALL_BUILDER[messageId] = this;
    }

    static init(bot: Telegraf<TelegrafContext>, logger: ILogger) {
        this.LOGGER = logger;
        [
            RecurrenceTypeSelection,
            DayOfMonthSelection,
            DayOfWeekSelection,
            HourSelection,
            ToHourSelection,
            MinuteSelection,
        ].forEach(selection => {
            selection.setActions(bot, this.handleButtonPress.bind(this));
        });
    }

    static handleButtonPress(ctx: TelegrafContext, selection: string) {
        handleButtonPress(this.ALL_BUILDER, this.LOGGER, ctx, selection);
    }

    async requestConfig() {
        await this.requestSelection(RecurrenceTypeSelection);

        if (this.config.type === "m") {
            await this.requestSelection(DayOfMonthSelection);
        } else {
            await this.requestSelection(DayOfWeekSelection);
        }

        await this.requestSelection(HourSelection);

        if (this.config.type === "h") {
            await this.requestSelection(ToHourSelection);
        }

        await this.requestSelection(MinuteSelection);

        delete TriggerConfigBuilder.ALL_BUILDER[this.messageId];

        return this.config;
    }

    getConfig() {
        return this.config;
    }

    private async requestSelection(
        Selection: new (
            editMessage: (text: string, extra?: ExtraReplyMessage) => Promise<void>,
            messageId: number,
        ) => AbstractSelection<IGenericRecurrence>,
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
