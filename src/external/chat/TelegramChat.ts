import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ILogger } from "../logging";
import { AbstractChat } from "./AbstractChat";

export class TelegramChat extends AbstractChat<{ botToken: string }> {
    private bot: Telegraf<TelegrafContext>;

    constructor(logger: ILogger, setupData: { botToken: string }) {
        super(logger, setupData);
        this.bot = new Telegraf(setupData.botToken);
    }

    public send(chatId: string, message: string) {
        this.bot.telegram.sendMessage(chatId, message);
    }

    public start() {
        if (!this.communication) {
            throw Error("Chat must be initialized!");
        }
        this.bot.start(ctx => {
            this.communication!.initChat(this.getChatId(ctx), this.getUser(ctx));
        });
        this.bot.command("set", ctx => {
            const payload = this.getPayload(ctx, "set");
            this.communication!.set(this.getChatId(ctx), this.getUser(ctx), payload);
        });
        this.bot.command("delete", ctx => {
            const payload = this.getPayload(ctx, "delete");
            this.communication!.delete(this.getChatId(ctx), this.getUser(ctx), payload);
        });
        this.bot.command("read", ctx => {
            this.communication!.read(this.getChatId(ctx));
        });
        this.bot.command("addAdmin", ctx => {
            const payload = this.getPayload(ctx, "addAdmin");
            this.communication!.addAdmin(this.getChatId(ctx), this.getUser(ctx), payload);
        });
        this.bot.command("removeAdmin", ctx => {
            const payload = this.getPayload(ctx, "removeAdmin");
            this.communication!.removeAdmin(this.getChatId(ctx), this.getUser(ctx), payload);
        });

        this.bot.launch();
    }

    private getChatId(ctx: TelegrafContext) {
        return `${ctx.chat?.id || "noChat"}`;
    }
    private getUser(ctx: TelegrafContext) {
        return ctx.from?.username || "noUser";
    }
    private getPayload(ctx: TelegrafContext, command: string) {
        const lengthForSlashAndSpace = 2;
        return (ctx.message?.text || "").substring(`${command}`.length + lengthForSlashAndSpace);
    }
}
