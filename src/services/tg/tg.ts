import { Readable } from 'node:stream';
import { Bot, InlineKeyboard } from 'grammy';
import { IConnectionService } from '@root/server/types';

export class TgService {
  private bot: Bot;
  private tg: IConnectionService;
  private tgStream: Readable &
    AsyncIterable<{
      chat_id: string | number;
      message: string;
      other?: Record<string, any>;
    }>;

  constructor() {
    this.bot = new Bot(env.TG_BOT_TOKEN!);
    this.tg = messengerService;
    this.tgStream = new Readable({ read: () => true, objectMode: true });
    this.sending();
  }

  async init() {
    await this.bot.init();
    const { botInfo } = this.bot;
    logger.info(botInfo);
  }

  private async sending() {
    for await (const { chat_id, message, other } of this.tgStream) {
      try {
        const result = await this.tg.sendNotification(chat_id, message, other);
        other?.onSuccess(result);
      } catch (e) {
        logger.warn(e);
        logger.warn("CANT'T SEND TO TELEGRAM", chat_id);
        other?.onError(e);
      }
    }
  }

  send(
    chat_id: number | string | null,
    message: string,
    other?: Record<string, any>,
  ) {
    if (chat_id) {
      this.tgStream.push({ chat_id, message, other });
    }
  }

  sendForbidden(chatId: string | number) {
    const origin = env.ORIGIN!;
    const contacts = new URL('/contacts', origin).href;
    const about = new URL('/about', origin).href;
    const message = 'Ви не можете відправляти повідомлення';
    const btns = [
      [{ text: 'КОНТАКТИ', web_app: { url: contacts } }],
      [{ text: 'ДОВІДКА', web_app: { url: about } }],
    ];
    const reply_markup = new InlineKeyboard(btns);
    return this.tg.sendNotification(chatId, message, { reply_markup });
  }

  async setMenuButton() {
    logger.info('SET MENU BUTTON');
    await this.bot.api
      .setChatMenuButton({
        menu_button: {
          type: 'web_app',
          text: 'Мережа',
          web_app: { url: origin },
        },
      })
      .catch(logger.error);
  }
}

export default () => new TgService();
