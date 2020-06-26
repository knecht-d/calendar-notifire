import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericFrame } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";
import { splitInChunks } from "../utils";

const prefix = "FRAME_DAY";
const values = [...[...Array(10).keys()].map(x => `+${x + 1}`)];
const skip = "SKIP";

export class DaySelection extends AbstractSelection<IGenericFrame> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}|${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
        bot.action(`${prefix}|${skip}`, ctx => selectionHandler(ctx, `${skip}`));
    }

    async requestInput(buildingObject: IGenericFrame): Promise<(selection: string) => IGenericFrame> {
        await this.editMessage(
            "Bis zu welchem Tag sollen die Termine betrachtet werden?",
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    [
                        ...splitInChunks(
                            values.map(value => Markup.callbackButton(value, `${prefix}|${value}`)),
                            5,
                        ),
                        [Markup.callbackButton("Aktueller Tag", `${prefix}|${skip}`)],
                    ],
                    { columns: 5 },
                ),
            ),
        );
        return (selection: string) => {
            if (selection !== skip) {
                buildingObject.day = {
                    fixed: false,
                    value: Number.parseInt(selection),
                };
            }
            return buildingObject;
        };
    }
}
