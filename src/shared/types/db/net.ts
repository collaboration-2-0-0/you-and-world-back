import {
  ITableMembers,
  ITableMembersToMembers,
  ITableNets,
  ITableNetsData,
  ITableNodes,
} from './tables';
import { OuterJoin } from './utils';

export const NET_VIEW_MAP = ['net', 'tree', 'circle'] as const;
export type NetViewKeys = (typeof NET_VIEW_MAP)[number];

export type INet = ITableNets & ITableNetsData;
export type INetData = INet & ITableNodes;
export type INetDataExtended = INetData & { total_count_of_members: number };

export type IUserNetData = ITableMembers &
  OuterJoin<ITableMembersToMembers> & {
    vote_count: number;
  };

/* net structure */
export type INodeMember = ITableNodes &
  OuterJoin<ITableMembers> & {
    invite: boolean;
    dislikes: number;
    votes: number;
  };
