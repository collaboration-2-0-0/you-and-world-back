import * as T from './tables';
import { OuterJoin } from './utils';

export const NET_VIEW_MAP = ['net', 'tree', 'circle'] as const;
export type NetViewKeys = (typeof NET_VIEW_MAP)[number];

export type INet = T.ITableNets & T.ITableNetsData;
export type INetData = INet & T.ITableNodes;
export type INetDataExtended = INetData & { total_count_of_members: number };

export type IUserNetData = T.ITableNodes &
  T.ITableMembers &
  OuterJoin<T.ITableMembersToMembers> & { vote_count: number };

/* net structure */
export type INodeMember = T.ITableNodes &
  OuterJoin<T.ITableMembers> & {
    invite: boolean;
    dislikes: number;
    votes: number;
  };
