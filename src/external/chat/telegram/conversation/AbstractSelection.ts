import Telegraf, { Context } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";

export abstract class AbstractSelection<T> {
    constructor(
        protected editMessage: (text: string, extra?: ExtraReplyMessage) => Promise<void>,
        protected messageId: number,
    ) {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    static setActions(_bot: Telegraf<TelegrafContext>, _selectionHandler: (ctx: Context, value: string) => void) {}
    abstract requestInput(buildingObject: T): Promise<(selection: string) => T>;
}
