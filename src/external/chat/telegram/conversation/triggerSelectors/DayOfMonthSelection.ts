import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericRecurrence } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "TRIGGER_DAY_OF_MONTH-";
const values = [...Array(31).keys()].map(value => value + 1);

export class DayOfMonthSelection extends AbstractSelection<IGenericRecurrence> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
    }

    async requestInput(buildingObject: IGenericRecurrence): Promise<(selection: string) => IGenericRecurrence> {
        await this.editMessage(
            `
An welchem Tag im Monat soll die Erinnerung erfolgen?
Gibt es den Tag nicht, dann findet in dem Monat keine Erinnerung statt!
z.B. "30. Februar"`.trim(),
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    values.map(value => Markup.callbackButton(`${value}`, `${prefix}${value}`)),
                    { columns: 4 },
                ),
            ),
        );
        return (selection: string) => {
            buildingObject.dayOfMonth = Number.parseInt(selection);
            return buildingObject;
        };
    }
}
