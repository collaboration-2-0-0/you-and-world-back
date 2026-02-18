/* eslint-disable max-len */
import { env } from 'node:process';
import { Context, InlineKeyboard } from 'grammy';

const origin = env.ORIGIN || 'https://example.com';
const contacts = new URL('/contacts', origin).href;
const about = new URL('/about', origin).href;

export const greeting = (ctx: Context) => {
  if (env.DEV === 'true') {
    const btns = [[{ text: origin, web_app: { url: origin } }]];
    const inlineKyeboard = new InlineKeyboard(btns);
    ctx.reply('ORIGIN', { reply_markup: inlineKyeboard });
  }

  return ctx.reply(`Вітаю, ${ctx.chat?.first_name} !`, { parse_mode: 'HTML' });
};

export const forbidden = (ctx: Context) => {
  const btns = [
    [{ text: 'КОНТАКТИ', web_app: { url: contacts } }],
    [{ text: 'ДОВІДКА', web_app: { url: about } }],
  ];
  const inlineKyeboard = new InlineKeyboard(btns);
  return ctx.reply('Ви не можете відправляти повідомлення', {
    reply_markup: inlineKyeboard,
  });
};
