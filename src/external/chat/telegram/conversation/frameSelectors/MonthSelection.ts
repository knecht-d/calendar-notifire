import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericFrame } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "FRAME_MONTH";
const values = ["+1", "+2", "+3"];
const skip = "SKIP";

export class MonthSelection extends AbstractSelection<IGenericFrame> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}|${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
        bot.action(`${prefix}|${skip}`, ctx => selectionHandler(ctx, `${skip}`));
    }

    async requestInput(buildingObject: IGenericFrame): Promise<(selection: string) => IGenericFrame> {
        await this.editMessage(
            "Bis zu welchem Monat sollen die Termine betrachtet werden?",
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    [
                        [...values.map(option => Markup.callbackButton(option, `${prefix}|${option}`))],
                        [Markup.callbackButton("Aktueller Monat", `${prefix}|${skip}`)],
                    ],
                    { columns: 2 },
                ),
            ),
        );
        return (selection: string) => {
            if (selection !== skip) {
                buildingObject.month = {
                    fixed: !selection.startsWith("+"),
                    value: Number.parseInt(selection),
                };
            }
            return buildingObject;
        };
    }
}
