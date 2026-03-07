import { ITableEvents, NetEventKeys, NetViewKeys } from '@shared/types/db';

export type IEvent = Omit<ITableEvents, 'net_view' | 'event_type'> & {
  net_view: NetViewKeys | null;
  event_type: NetEventKeys;
};

export type IEvents = IEvent[];

export type IEventRecord = Omit<
  IEvent,
  'event_id' | 'event_type' | 'net_id' | 'date'
> & { net_id?: null; netName?: string };
