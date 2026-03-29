import { env } from 'node:process';
import { Bot, BotError, Context, InlineKeyboard } from 'grammy';
import { Message } from 'grammy/types';
import { IObject } from '@root/types';
import { IOperation, THandleOperation } from '@root/controller/operation.types';
import { IInputConnection } from '../types';
import { ServerError } from '../errors';
import { ITgConfig, ITgServer } from './types';
import { getUrlFromArg } from './utils';
import { greeting } from './reply';

class TgConnection implements IInputConnection {
  private exec?: THandleOperation;
  private server: ITgServer;
  private origin = env.ORIGIN!;

  constructor(private config: ITgConfig) {
    this.server = new Bot(env.TG_BOT_TOKEN!);
    this.server.on('message', this.handleRequest.bind(this));
    this.server.on('edit', this.handleRequest.bind(this));
    this.server.on('callback_query', this.handleCallback.bind(this));
    this.server.catch(this.handleError.bind(this));
  }

  onOperation(cb: THandleOperation) {
    this.exec = cb;
  }

  setUnavailable() {
    return;
  }

  getServer() {
    return this.server;
  }

  async start() {
    if (!this.exec) {
      const e = new ServerError('NO_CALLBACK');
      logger.error(e);
      throw e;
    }

    try {
      await new Promise((onStart, onError) => {
        this.server.start({ onStart }).catch(onError);
      });
    } catch (e: any) {
      logger.error(e);
      throw new ServerError('LISTEN_ERROR');
    }
  }

  async stop() {
    return this.server.stop();
  }

  private async handleRequest(ctx: Context) {
    const { url, operation } = this.getOparation(ctx, this.origin) || {};

    if (url) {
      const webAppButton = { text: 'ПЕРЕЙТИ', web_app: { url } };
      const reply_markup = new InlineKeyboard([[webAppButton]]);
      return ctx.reply('Для продовження натисність Перейти', { reply_markup });
    }

    if (!operation) {
      return greeting(ctx);
    }

    return this.execOperation(ctx, operation);
  }

  getOparation(ctx: Context, origin: string) {
    const { chat, message, editedMessage } = ctx;
    const chatId = chat?.id;
    const { text } = message || editedMessage || {};

    if (!chatId || !text) {
      return;
    }

    /* /start */
    if (/^\/start$/.test(text)) {
      return;
    }

    /* /start base64-token_or_pathname */
    const startParam = text.match(/^\/start (.+)$/)?.[1];
    if (startParam) {
      const url = getUrlFromArg(origin, startParam);

      if (url) {
        return { url };
      }

      const operation = {
        options: { sessionKey: 'admin:tg', origin: 'https://t.me' },
        names: 'account/messenger/link/connect'.split('/'),
        data: { params: { chatId, token: startParam } },
      };

      return { operation };
    }

    const operation = {
      options: {
        sessionKey: 'admin:tg',
        origin: 'https://t.me',
        isAdmin: true,
      },
      names: 'bot/message'.split('/'),
      data: {
        params: {
          chatId,
          message: (message || editedMessage) as unknown as IObject,
        },
      },
    };

    return { operation };
  }

  async execOperation(ctx: Context, operation: IOperation) {
    try {
      const result = await this.exec!(operation);
      if (result) {
        ctx.reply(`${result}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      ctx.reply('Сталася помилка!');
    }
  }

  handleCallback(ctx: Context) {
    ctx.answerCallbackQuery();

    const { chat, callbackQuery } = ctx;
    const chatId = chat!.id;
    const { data = '' } = callbackQuery || {};

    const [, strNetId] = data.split(':');
    const netId = Number(strNetId);

    const operation = {
      options: {
        sessionKey: 'admin:messenger',
        origin: 'https://t.me',
        isAdmin: true,
      },
      names: 'bot/message'.split('/'),
      data: {
        params: {
          chatId,
          netId,
        },
      },
    };

    this.execOperation(ctx, operation);
  }

  private async sendNotification(
    chatId: number | string,
    text = '',
    other: Record<string, any> = {},
  ): Promise<Message.TextMessage> {
    const result = await this.server.api.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      ...other,
    });

    return result;
  }

  private handleError(error: BotError) {
    const details = (error.error as any).message || {};
    logger.warn(details);
  }

  getConnectionService() {
    return {
      sendMessage: () => Promise.resolve(false),
      sendNotification: this.sendNotification.bind(this),
    };
  }
}

export = TgConnection;
