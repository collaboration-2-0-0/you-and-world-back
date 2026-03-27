import { IEventMessage, INewEventsMessage } from '@shared/types/api';

export interface IMeesageStream {
  user_id?: number;
  net_id?: number;
  connectionIds: Set<number>;
  message: INewEventsMessage | IEventMessage;
}

export type IInstantEvent = Omit<IEventMessage, 'type' | 'event_id' | 'date'>;
