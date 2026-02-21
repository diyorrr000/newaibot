require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const OpenAI = require('openai');
const express = require('express');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// Puter Client (Server-side uchun)
const puterClient = new OpenAI({
    apiKey: process.env.PUTER_API_KEY,
    baseURL: 'https://api.puter.com/v1',
});

const WEBAPP_URL = process.env.WEBAPP_URL || 'https://newaibot.onrender.com';

// User session storage
const userSessions = {};

app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    ctx.reply(`Salom! Men Grok AI botman. 🤖\n\nMenga to'g'ridan-to'g'ri xabar yozishingiz yoki Mini Appni ochishingiz mumkin.`, Markup.keyboard([
        ['💬 Chatni boshlash', '🎨 Rasm chizish'],
        [Markup.button.webApp('🚀 Mini App (Premium UI)', WEBAPP_URL)]
    ]).resize());
});

bot.hears('💬 Chatni boshlash', (ctx) => ctx.reply('Savolingizni yozavering, men Grok 4.1 orqali javob beraman!'));
bot.hears('🎨 Rasm chizish', (ctx) => ctx.reply('Rasm uchun tavsif yuboring (Masalan: "Astronaut on Mars")'));

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return;

    try {
        await ctx.sendChatAction('typing');

        // Agar Puter API Key bo'lsa foydalanamiz, bo'lmasa eslatma beramiz
        if (!process.env.PUTER_API_KEY || process.env.PUTER_API_KEY.includes('YOUR_')) {
            return ctx.reply("Bot serverida PUTER_API_KEY sozlanmagan. Iltimos, .env fayliga yoki Render settingsga Puter Auth Tokenni qo'shing.");
        }

        const response = await puterClient.chat.completions.create({
            model: "x-ai/grok-4-1-fast",
            messages: [{ role: "user", content: text }],
        });

        await ctx.reply(response.choices[0].message.content, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error(error);
        ctx.reply('Xatolik: ' + error.message);
    }
});

// Start Express
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start Bot
bot.launch().then(() => console.log('Bot is running!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
