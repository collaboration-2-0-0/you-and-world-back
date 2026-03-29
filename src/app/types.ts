import { IConfig } from '@root/config/types';
import { ILogger } from '@root/logger/types';
import { IDatabase, IDatabaseQueries } from '@db/types';
import { IDomain } from '@domain/index';
import { IController } from '@root/controller/types';
import { IInputConnection, IConnectionService } from '@root/server/types';
import { IMailService } from '@root/services/types';
import { ChatService, NotificationService, TgService } from '@root/services';
import App from './app';

export type IAppThis = App & {
  config: IConfig;
  logger?: ILogger;
  controller?: IController;
  server?: IInputConnection;
  apiServer?: IInputConnection;
  shutdown: () => Promise<void>;
  setInputConnection: () => Promise<IAppThis>;
};

export interface IControllerContext {
  execQuery: IDatabaseQueries;
  startTransaction: IDatabase['startTransaction'];
  logger: ILogger;
  connectionService: IConnectionService;
  messengerService: IConnectionService;
  console?: typeof console;
  env?: IConfig['env'];
}

declare global {
  const execQuery: IDatabaseQueries;
  const startTransaction: IDatabase['startTransaction'];
  const logger: ILogger;
  const connectionService: IConnectionService;
  const messengerService: IConnectionService;
  const cryptoService: typeof import('../utils/crypto');
  const mailService: IMailService;
  const chatService: ChatService;
  const notificationService: NotificationService;
  const tgService: TgService;
  const env: IConfig['env'];
  const domain: IDomain;
}
