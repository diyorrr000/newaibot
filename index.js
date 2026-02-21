require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// URL where your app will be hosted.
// On Render, this will be your .onrender.com URL
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    ctx.reply(`Salom ${ctx.from.first_name}!
Grok AI 4.1 botiga xush kelibsiz.

Ushbu bot Puter.js yordamida API kalitsiz va mutlaqo bepul ishlaydi (User-Pays modeli).

Quyidagi tugmani bosib Grok AI bilan suhbatni boshlang:`, Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Grok AI ni ochish', WEBAPP_URL)]
    ]));
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

// Start Telegram Bot
bot.launch().then(() => {
    console.log('Bot ishga tushdi!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
