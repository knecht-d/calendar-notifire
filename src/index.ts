/* istanbul ignore file */
import Telegraf from "telegraf";

const chatId = 42;
const token = "<token>";
const bot = new Telegraf(token);

// Default commands
bot.start(ctx => ctx.reply(`Welcome ${ctx.chat?.first_name} (${ctx.chat?.id})`));
bot.help(ctx => ctx.reply("Send me a sticker"));

// Custom commands
bot.command("test", ({ reply }) => reply("passed"));

// Specific message types
bot.on("sticker", ctx => ctx.reply("👍"));

// Specific texts
bot.hears("hi", ctx => ctx.reply("Hey there"));

// Start
bot.launch().catch(console.error);

// Custom message
bot.telegram.sendMessage(chatId, "I'm Back!").catch(console.error);
