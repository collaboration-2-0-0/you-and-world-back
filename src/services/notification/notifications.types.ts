import { IEventMessage, INewEventsMessage } from '../../shared/server/types';

export interface IMeesageStream {
  user_id?: number;
  net_id?: number;
  connectionIds: Set<number>;
  message: INewEventsMessage | IEventMessage;
}
