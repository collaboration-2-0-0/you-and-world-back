import { IMessage, MessageTypeKeys } from '@domain/types';

export interface ILinkConfig {
  path: string;
}

export interface ILinkConnection {
  onMessage: <T extends MessageTypeKeys>(data: IMessage<T>) => void;
}
