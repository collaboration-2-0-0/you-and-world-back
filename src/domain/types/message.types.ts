import { IEventMessage, INewEventsMessage } from './event.types';

export interface IMessagesMap {
  // CHAT: IChatResponseMessage;
  EVENT: IEventMessage;
  NEW_EVENTS: INewEventsMessage;
}
export type MessageTypeKeys = keyof IMessagesMap;

export type IMessage<T extends MessageTypeKeys> = IMessagesMap[T];
