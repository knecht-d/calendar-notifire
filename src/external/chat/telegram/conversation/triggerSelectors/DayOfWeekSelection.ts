import Telegraf, { Context, Extra, Markup } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { IGenericRecurrence } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const daysOfWeekPrefix = "TRIGGER_DAYS_OF_WEEK-";
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const done = "DONE";

// const dayOfWeekMonday = `${daysOfWeekPrefix}Mon`;
// const dayOfWeekTuesday = `${daysOfWeekPrefix}Tue`;
// const dayOfWeekWednesday = `${daysOfWeekPrefix}Wed`;
// const dayOfWeekThursday = `${daysOfWeekPrefix}Thu`;
// const dayOfWeekFriday = `${daysOfWeekPrefix}Fri`;
// const dayOfWeekSatuarday = `${daysOfWeekPrefix}Sat`;
// const dayOfWeekSunday = `${daysOfWeekPrefix}Sun`;
// const dayOfWeekDone = `${daysOfWeekPrefix}DONE`;

export class DayOfWeekSelection extends AbstractSelection<IGenericRecurrence> {
    static ALL_SELECTIONS: { [messageId: number]: DayOfWeekSelection } = {};
    daysOfWeek = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
    };

    constructor(editMessage: (text: string, extra?: ExtraReplyMessage) => Promise<void>, messageId: number) {
        super(editMessage, messageId);
        DayOfWeekSelection.ALL_SELECTIONS[this.messageId] = this;
    }

    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        days.forEach(day => {
            bot.action(`${daysOfWeekPrefix}${day}`, ctx => this.handleDay(ctx, day));
        });
        bot.action(`${daysOfWeekPrefix}${done}`, ctx => selectionHandler(ctx, done));
    }

    static handleDay(ctx: TelegrafContext, selection: string) {
        const currentSelection = this.ALL_SELECTIONS[ctx.callbackQuery?.message?.message_id || 0];
        if (currentSelection) {
            const typedSelection = selection as keyof typeof currentSelection.daysOfWeek;
            currentSelection.daysOfWeek[typedSelection] = !currentSelection.daysOfWeek[typedSelection];

            currentSelection.replyForDaysOfWeek().catch(() => {
                // this.LOGGER.error("TriggerConfigBuilder", error)
                currentSelection
                    .editMessage(
                        "Nachricht konnte nicht weiter verarbeitet werden. Versuchen Sie es mit einem erneuten Befehl.",
                    )
                    .catch(() => {
                        // this.LOGGER.error("TriggerConfigBuilder", error)
                    });
            });
        } else {
            ctx.editMessageText(
                "Nachricht konnte nicht weiter verarbeitet werden. Versuchen Sie es mit einem erneuten Befehl.",
            ).catch(() => {
                // this.LOGGER.error("TriggerConfigBuilder", error)
            });
        }
    }

    async requestInput(buildingObject: IGenericRecurrence): Promise<(selection: string) => IGenericRecurrence> {
        await this.replyForDaysOfWeek();
        return () => {
            delete DayOfWeekSelection.ALL_SELECTIONS[this.messageId];
            buildingObject.daysOfWeek = this.daysOfWeek;
            return buildingObject;
        };
    }

    private replyForDaysOfWeek() {
        const mondayBtn = Markup.callbackButton(
            `${this.daysOfWeek.monday ? "✓" : " "}Montag `,
            `${daysOfWeekPrefix}${days[0]}`,
        );
        const tuesdayBtn = Markup.callbackButton(
            `${this.daysOfWeek.tuesday ? "✓" : " "}Dienstag `,
            `${daysOfWeekPrefix}${days[1]}`,
        );
        const wednesdayBtn = Markup.callbackButton(
            `${this.daysOfWeek.wednesday ? "✓" : " "}Mittwoch `,
            `${daysOfWeekPrefix}${days[2]}`,
        );
        const thursdayBtn = Markup.callbackButton(
            `${this.daysOfWeek.thursday ? "✓" : " "}Donnerstag `,
            `${daysOfWeekPrefix}${days[3]}`,
        );
        const fridayBtn = Markup.callbackButton(
            `${this.daysOfWeek.friday ? "✓" : " "}Freitag `,
            `${daysOfWeekPrefix}${days[4]}`,
        );
        const saturdayBtn = Markup.callbackButton(
            `${this.daysOfWeek.saturday ? "✓" : " "}Samstag `,
            `${daysOfWeekPrefix}${days[5]}`,
        );
        const sundayBtn = Markup.callbackButton(
            `${this.daysOfWeek.sunday ? "✓" : " "}Sonntag `,
            `${daysOfWeekPrefix}${days[6]}`,
        );
        const doneBtn = Markup.callbackButton("Fertig", `${daysOfWeekPrefix}${done}`);
        return this.editMessage(
            "An welchen Tagen soll eine Erinnerung erfolgen?",
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    [
                        [mondayBtn, fridayBtn],
                        [tuesdayBtn, saturdayBtn],
                        [wednesdayBtn, sundayBtn],
                        [thursdayBtn, doneBtn],
                    ],
                    {},
                ),
            ),
        );
    }
}
