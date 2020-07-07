import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { IGenericConfig } from "../../../gateways";
import { ILogger, logCall, LogLevels, logTime } from "../../logging";
import { AbstractChat } from "../AbstractChat";
import { FrameConfigBuilder } from "./conversation/FrameConfigBuilder";
import { TriggerConfigBuilder } from "./conversation/TriggerConfigBuilder";

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
            await this.wrapInTryCatch(async () => {
                const triggerId = this.getPayload(ctx, "set").trim();
                if (!triggerId) {
                    await ctx.reply("Trigger Id fehlt!");
                    return;
                }
                const message = await ctx.reply("Moment...");
                const chatId = this.getChatId(ctx);
                const user = this.getUser(ctx);

                const editMessage = async (text: string, extra?: ExtraReplyMessage) => {
                    await this.bot.telegram.editMessageText(chatId, message.message_id, undefined, text, extra);
                };
                const config: IGenericConfig = {};
                const triggerBuilder = new TriggerConfigBuilder(message.message_id, editMessage);
                const frameEndBuilder = new FrameConfigBuilder(message.message_id, editMessage);
                triggerBuilder
                    .requestConfig()
                    .then(triggerConfig => frameEndBuilder.requestConfig(triggerConfig))
                    .then(async () => {
                        config.recurrence = triggerBuilder.getConfig();
                        config.frame = {
                            begin: {}, // For Telegram only the current data as a start frame is possible!
                            end: frameEndBuilder.getConfig(),
                        };
                        await editMessage("Moment ...");
                        await this.communication!.set(chatId, user, triggerId, config);
                    })
                    .catch(error => this.logger.error("TelegramChat", error));
            });
        });

        TriggerConfigBuilder.init(this.bot, this.logger);
        FrameConfigBuilder.init(this.bot, this.logger);

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
        this.bot.command("info", async ctx => {
            await ctx.reply(`ChatId: ${this.getChatId(ctx)}\nUserId: ${this.getUser(ctx)}`);
        });

        this.bot.on("callback_query", async ctx => {
            await ctx.reply(`Invalid Callback ${ctx.callbackQuery?.data}`);
        });

        await this.wrapInTryCatch(async () => this.bot.launch());
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
        return `${ctx.from?.id || "noUser"}`;
    }
    private getPayload(ctx: TelegrafContext, command: string) {
        const lengthForSlashAndSpace = 2;
        return (ctx.message?.text || "").substring(`${command}`.length + lengthForSlashAndSpace);
    }
}
