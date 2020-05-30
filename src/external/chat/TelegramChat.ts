import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ILogger, logCall, LogLevels, logTime } from "../logging";
import { AbstractChat } from "./AbstractChat";

export class TelegramChat extends AbstractChat<{ botToken: string }> {
    private bot: Telegraf<TelegrafContext>;

    constructor(logger: ILogger, setupData: { botToken: string }) {
        super(logger, setupData);
        this.bot = new Telegraf(setupData.botToken);
        logger.info("TelegramChat", `Created with Token [${setupData.botToken}]`);
    }

    @logCall({ level: LogLevels.info })
    @logTime({ async: false })
    public async send(chatId: string, message: string) {
        try {
            await this.bot.telegram.sendMessage(chatId, message);
        } catch (error) {
            this.logger.error("TelegramChat", error);
        }
    }

    @logCall({ level: LogLevels.info })
    @logTime({ async: false })
    public async start() {
        if (!this.communication) {
            this.logger.error("TelegramChat", "Chat not initialized!");
            throw Error("Chat must be initialized!");
        }
        this.bot.start(async ctx => {
            await this.wrapInTryCatch(() => this.communication!.initChat(this.getChatId(ctx), this.getUser(ctx)));
        });
        this.bot.command("set", async ctx => {
            const payload = this.getPayload(ctx, "set");
            await this.wrapInTryCatch(() => this.communication!.set(this.getChatId(ctx), this.getUser(ctx), payload));
        });
        this.bot.command("delete", async ctx => {
            const payload = this.getPayload(ctx, "delete");
            await this.wrapInTryCatch(() =>
                this.communication!.delete(this.getChatId(ctx), this.getUser(ctx), payload),
            );
        });
        this.bot.command("read", async ctx => {
            await this.wrapInTryCatch(() => this.communication!.read(this.getChatId(ctx)));
        });
        this.bot.command("addAdmin", async ctx => {
            const payload = this.getPayload(ctx, "addAdmin");
            await this.wrapInTryCatch(() =>
                this.communication!.addAdmin(this.getChatId(ctx), this.getUser(ctx), payload),
            );
        });
        this.bot.command("removeAdmin", async ctx => {
            const payload = this.getPayload(ctx, "removeAdmin");
            await this.wrapInTryCatch(() =>
                this.communication!.removeAdmin(this.getChatId(ctx), this.getUser(ctx), payload),
            );
        });

        await this.wrapInTryCatch(() => this.bot.launch());
    }

    private async wrapInTryCatch(fn: () => Promise<void>): Promise<void> {
        try {
            await fn();
        } catch (error) {
            this.logger.error("TelegramChat", error);
        }
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
