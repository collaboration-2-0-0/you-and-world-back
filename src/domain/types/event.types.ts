import { ITableEvents, NetEventKeys, NetViewKeys } from '@shared/types/db';
import { MessageTypeKeys } from './message.types';

export type IEvent = Omit<ITableEvents, 'net_view' | 'event_type'> & {
  net_view: NetViewKeys | null;
  event_type: NetEventKeys;
};

export type IEventRecord = Omit<
  IEvent,
  'event_id' | 'event_type' | 'net_id' | 'date'
> & { net_id?: null; netName?: string };

export type IEventMessage = {
  type: Extract<MessageTypeKeys, 'EVENT'>;
} & IEvent;

export interface INewEventsMessage {
  type: Extract<MessageTypeKeys, 'NEW_EVENTS'>;
}
