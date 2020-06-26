import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericFrame } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "FRAME_HOUR";
const values = [...[...Array(24).keys()].map(x => `${x}`), ...[...Array(12).keys()].map(x => `+${x + 1}`)];
const skip = "SKIP";

export class HourSelection extends AbstractSelection<IGenericFrame> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}|${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
        bot.action(`${prefix}|${skip}`, ctx => selectionHandler(ctx, `${skip}`));
    }

    async requestInput(buildingObject: IGenericFrame): Promise<(selection: string) => IGenericFrame> {
        await this.editMessage(
            `
Bis zu welcher Stunde sollen die Termine betrachtet werden?

+/- und "Aktuelle Stunde" bedeuten, dass der Wert relativ zum Zeitpunkt der Erinnerung betrachtet wird.
z.B. "-5" Stunden um 17:00 , dass Termine ab 12:00 betrachtet werden.`.trim(),
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    [
                        ...values.map(option => Markup.callbackButton(option, `${prefix}|${option}`)),
                        Markup.callbackButton("Aktuelle Stunde", `${prefix}|${skip}`),
                    ],
                    { columns: 6 },
                ),
            ),
        );
        return (selection: string) => {
            if (selection !== skip) {
                buildingObject.hour = {
                    fixed: !selection.startsWith("+"),
                    value: Number.parseInt(selection),
                };
            }
            return buildingObject;
        };
    }
}
