import * as T from './db.types';
import { INetMember } from './member.types';

export type INet = T.ITableNets & T.ITableNetsData;

export type IUserNet = T.ITableNets &
  T.ITableNetsData &
  T.ITableNodes &
  T.ITableMembers;

export const NET_VIEW_MAP = ['net', 'tree', 'circle'] as const;
export type NetViewKeys = (typeof NET_VIEW_MAP)[number];

/* net structure */
export type INetNode = {
  member: INetMember;
  tree: INetNode[] | null;
  connection: boolean;
};
