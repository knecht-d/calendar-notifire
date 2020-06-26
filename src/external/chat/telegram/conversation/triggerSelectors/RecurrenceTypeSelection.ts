import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericRecurrence } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "TRIGGER_REC_TYPE-";
const values = ["h", "d", "m"];

export class RecurrenceTypeSelection extends AbstractSelection<IGenericRecurrence> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
    }

    async requestInput(buildingObject: IGenericRecurrence): Promise<(selection: string) => IGenericRecurrence> {
        await this.editMessage(
            `
Wie häufig soll die Erinnerung geprüft werden?
<b>Stündlich </b>
 - An bestimmten Tagen der Woche in einem bestimmten Zeitfenster

<b>Täglich </b>
 - An bestimmten Tagen der Woche zu einer festen Zeit

<b>Monatlich </b>
 - An bestimmten Tag im Monat zu einer festen Zeit`.trim(),
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    [
                        Markup.callbackButton("Stündlich", `${prefix}h`),
                        Markup.callbackButton("Täglich", `${prefix}d`),
                        Markup.callbackButton("Monatlich", `${prefix}m`),
                    ],
                    { columns: 1 },
                ),
            ),
        );
        return (selection: string) => {
            buildingObject.type = selection as IGenericRecurrence["type"];
            return buildingObject;
        };
    }
}
