import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericRecurrence } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const hourPrefix = "TRIGGER_HOUR-";
const values = [...Array(24).keys()];

export class HourSelection extends AbstractSelection<IGenericRecurrence> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${hourPrefix}${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
    }

    async requestInput(buildingObject: IGenericRecurrence): Promise<(selection: string) => IGenericRecurrence> {
        await this.editMessage(
            `${buildingObject.type === "h" ? "Ab" : "Zu"} welcher Stunde soll die Erinnerung erfolgen?`,
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    values.map(value => Markup.callbackButton(`${value}`, `${hourPrefix}${value}`)),
                    { columns: 4 },
                ),
            ),
        );
        return (selection: string) => {
            buildingObject.hour = Number.parseInt(selection);
            return buildingObject;
        };
    }
}
