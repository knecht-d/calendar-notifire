import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericRecurrence } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "TRIGGER_TO_HOUR-";
const values = [...Array(24).keys()];

export class ToHourSelection extends AbstractSelection<IGenericRecurrence> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
    }

    async requestInput(buildingObject: IGenericRecurrence): Promise<(selection: string) => IGenericRecurrence> {
        const fromHour = buildingObject.hour || 0;
        await this.editMessage(
            "Bis zu welcher Stunde soll die Erinnerung erfolgen?",
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    values
                        .filter(value => value >= fromHour)
                        .map(value => Markup.callbackButton(`${value}`, `${prefix}${value}`)),
                    { columns: 4 },
                ),
            ),
        );
        return (selection: string) => {
            buildingObject.hourEnd = Number.parseInt(selection);
            return buildingObject;
        };
    }
}
