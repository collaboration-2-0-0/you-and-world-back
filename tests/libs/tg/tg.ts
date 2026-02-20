import { Bot, Context, InlineKeyboard } from 'grammy';
import { MenuButton } from 'grammy/types';
import envJson from '../../../.env.json';

const TOKEN = envJson.TG_BOT_TOKEN;
const ORIGIN = envJson.ORIGIN;

export class TgConnection {
  private server;

  constructor() {
    this.server = new Bot(TOKEN);
    this.server.on('message', this.handleRequest.bind(this));
    this.server.on('edit', this.handleRequest.bind(this));
    this.server.on('callback_query', this.handleCallback.bind(this));
    this.server.catch(console.error);
  }

  start() {
    return new Promise((onStart, onError) => {
      this.server.start({ onStart }).catch(onError);
    });
  }

  stop() {
    return this.server.stop();
  }

  sendNotification(chatId: number, text = '', other: Record<string, any> = {}) {
    this.server.api.sendMessage(chatId, text, { parse_mode: 'HTML', ...other });
  }

  setMenuButton() {
    const menu_button: MenuButton = {
      type: 'web_app',
      text: 'OPEN',
      web_app: { url: ORIGIN },
    };

    return this.server.api.setChatMenuButton({ menu_button });
  }

  async handleRequest(ctx: Context) {
    const { chat, message, editedMessage } = ctx;
    const chatId = chat?.id;
    const { text } = message || editedMessage || {};

    console.log({ chatId, text });

    return this.sendInlineButtons(ctx);
  }

  sendWebAppInlineButton(ctx: Context) {
    const inlineKyeboard = new InlineKeyboard([
      [{ text: 'ПЕРЕЙТИ', web_app: { url: ORIGIN } }],
    ]);

    return ctx.reply('WebApp', {
      reply_markup: inlineKyeboard,
    });
  }

  sendInlineButtons(ctx: Context) {
    const buttons = [
      [{ text: 'first', callback_data: '/callback1' }],
      [{ text: 'second', callback_data: '/callback2' }],
    ];
    const reply_markup = new InlineKeyboard(buttons);

    return ctx.reply('message', { reply_markup });
  }

  handleCallback(ctx: Context) {
    const { chat, callbackQuery } = ctx;
    const chatId = chat?.id;
    const { data } = callbackQuery || {};

    console.log({ chatId, data });

    return ctx.answerCallbackQuery();
  }
}
