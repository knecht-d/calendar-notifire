import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericFrame } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "FRAME_MINUTE";
const values = ["0", "15", "30", "45", "59", "+15", "+30", "+45"];
const skip = "SKIP";

export class MinuteSelection extends AbstractSelection<IGenericFrame> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}|${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
        bot.action(`${prefix}|${skip}`, ctx => selectionHandler(ctx, `${skip}`));
    }

    async requestInput(buildingObject: IGenericFrame): Promise<(selection: string) => IGenericFrame> {
        await this.editMessage(
            `
Bis zu welcher Minute sollen die Termine betrachtet werden?

+/- und "Aktuelle Minute" bedeuten, dass der Wert relativ zum Zeitpunkt der Erinnerung betrachtet wird.
z.B. "+30" Minuten um 12:00 , dass Termine ab 12:30 betrachtet werden.`.trim(),
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    [
                        [
                            ...values
                                .filter(option => !option.startsWith("+"))
                                .map(option => Markup.callbackButton(option, `${prefix}|${option}`)),
                        ],

                        [
                            ...values
                                .filter(option => option.startsWith("+"))
                                .map(option => Markup.callbackButton(option, `${prefix}|${option}`)),
                        ],
                        [Markup.callbackButton("Aktuelle Minute", `${prefix}|${skip}`)],
                    ],
                    { columns: 4 },
                ),
            ),
        );
        return (selection: string) => {
            if (selection !== skip) {
                buildingObject.minute = {
                    fixed: !selection.startsWith("+"),
                    value: Number.parseInt(selection),
                };
            }
            return buildingObject;
        };
    }
}
