import { TgConnection } from './tg';

const tg = new TgConnection();

tg.start()
  .then(console.log)
  .then(() => tg.server.isInited())
  .then(console.log);

// const run = async () => {
//   try {
//     console.log(tg.server.isInited());
//     console.log(tg.server.botInfo);
//   } catch (e: any) {
//     console.log(e.message);
//   }

//   await tg.server.init();
//   console.log(tg.server.isInited());
//   console.log(tg.server.botInfo);

//   await tg.sendNotification(831299334, 'hello').then(console.log);
// };

// run();
