import { TgConnection } from './tg';

const tg = new TgConnection();
tg.start().then(console.log);
