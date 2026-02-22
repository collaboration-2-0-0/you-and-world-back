import ws from 'ws';
import { IMessage, MessageTypeKeys } from '../../shared/types/api';
import {
  IOperation,
  TOperationResponse,
} from '../../controller/operation.types';
import { TWsResModulesKeys } from './constants';

export interface IWsConfig {
  path: string;
  modulesPath: string;
  resModules: TWsResModulesKeys[];
}

export type IWsServer = ws.Server<IWsConnection>;
export type IWsConnection = ws.WebSocket & { isAlive?: boolean };
export type WsConnectionMap = Map<number, IWsConnection>;

export type TWsResModule<T = any> = (
  config: T,
) => (
  connection: IWsConnection | IWsConnection[],
  options: IOperation['options'] | null,
  data: TOperationResponse | IMessage<MessageTypeKeys>,
) => Promise<boolean>;
