import {
  IMessage,
  MessageTypeKeys,
} from '../../shared/types/api/messages.types';

export interface ILinkConfig {
  path: string;
}

export interface ILinkConnection {
  onMessage: <T extends MessageTypeKeys>(data: IMessage<T>) => void;
}
