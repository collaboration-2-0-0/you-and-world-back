/* eslint-disable max-len */
import { env } from 'node:process';
import { Context, InlineKeyboard } from 'grammy';

const origin = env.ORIGIN || 'https://example.com';

export const greeting = (ctx: Context) => {
  if (env.DEV === 'true') {
    const btns = [[{ text: origin, web_app: { url: origin } }]];
    const inlineKyeboard = new InlineKeyboard(btns);
    ctx.reply('ORIGIN', { reply_markup: inlineKyeboard });
  }

  return ctx.reply(`Вітаю, ${ctx.chat?.first_name} !`, { parse_mode: 'HTML' });
};
