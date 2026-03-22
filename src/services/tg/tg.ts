import { Bot } from 'grammy';

export class TgService {
  private bot: Bot;

  constructor() {
    this.bot = new Bot(env.TG_BOT_TOKEN!);
  }

  async init() {
    await this.bot.init();
    const { botInfo } = this.bot;
    logger.info(botInfo);
  }
}

export default () => new TgService();
