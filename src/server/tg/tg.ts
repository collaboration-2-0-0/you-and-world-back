import { env } from 'node:process';
import { Bot, BotError, Context, InlineKeyboard } from 'grammy';
import { Message } from 'grammy/types';
import { IOperation, THandleOperation } from '../../controller/operation.types';
import { IInputConnection } from '../types';
import { ITgConfig, ITgServer } from './types';
import { ServerError } from '../errors';
import { getOparation } from './getOperation';
import { greeting, forbidden } from './reply';

class TgConnection implements IInputConnection {
  private exec?: THandleOperation;
  private server: ITgServer;
  private origin = env.ORIGIN || 'https://example.com';

  constructor(private config: ITgConfig) {
    this.server = new Bot(this.config.token);
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

    // logger.info('SET MENU BUTTON');
    // await this.server.api
    //   .setChatMenuButton({
    //     // menu_button: { type: 'default' },
    //     menu_button: {
    //       type: 'web_app',
    //       text: 'OPEN',
    //       web_app: { url: this.origin },
    //     },
    //   })
    //   .catch(logger.error);
  }

  async stop() {
    return this.server.stop();
  }

  private async handleRequest(ctx: Context) {
    const { operation, url } = getOparation(ctx, this.origin) || {};

    if (url) {
      const inlineKyeboard = new InlineKeyboard([
        [{ text: 'ПЕРЕЙТИ', web_app: { url } }],
      ]);
      return ctx.reply('Для продовження натисність Перейти', {
        reply_markup: inlineKyeboard,
      });
    }

    return this.execOperation(ctx, operation);
  }

  async execOperation(ctx: Context, operation?: IOperation) {
    if (!operation) {
      greeting(ctx);
      return;
    }

    try {
      const result = await this.exec!(operation);
      if (result) {
        typeof result === 'object' &&
          'message' in result &&
          ctx.reply(`${result.message}`, { parse_mode: 'HTML' });
      } else {
        forbidden(ctx);
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
    chatId: number,
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
    const details = (error.error as any)?.message || {};
    logger.warn(details);
    // throw new ServerError('SERVER_ERROR', details);
  }

  getConnectionService() {
    return {
      sendMessage: () => Promise.resolve(false),
      sendNotification: this.sendNotification.bind(this),
    };
  }
}

export = TgConnection;
