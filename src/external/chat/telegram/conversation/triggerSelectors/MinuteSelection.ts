import Telegraf, { Context, Extra, Markup } from "telegraf";
import { IGenericRecurrence } from "../../../../../gateways";
import { AbstractSelection } from "../AbstractSelection";

const prefix = "TRIGGER_MINUTE-";
const values = [0, 10, 15, 20, 30, 40, 45, 50];

export class MinuteSelection extends AbstractSelection<IGenericRecurrence> {
    static setActions(bot: Telegraf<Context>, selectionHandler: (ctx: Context, value: string) => void): void {
        values.forEach(value => {
            bot.action(`${prefix}${value}`, ctx => selectionHandler(ctx, `${value}`));
        });
    }

    async requestInput(buildingObject: IGenericRecurrence): Promise<(selection: string) => IGenericRecurrence> {
        await this.editMessage(
            "Zu welcher Minute soll die Erinnerung erfolgen?",
            Extra.HTML().markup(() =>
                Markup.inlineKeyboard(
                    values.map(value => Markup.callbackButton(`${value}`, `${prefix}${value}`)),
                    { columns: 4 },
                ),
            ),
        );
        return (selection: string) => {
            buildingObject.minute = Number.parseInt(selection);
            return buildingObject;
        };
    }
}
