import ws from 'ws';
import {
  IOperation,
  TOperationResponse,
} from '@root/controller/operation.types';
import { IMessage, MessageTypeKeys } from '../../shared/types/api';
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
