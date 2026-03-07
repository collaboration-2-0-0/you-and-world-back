import * as T from '@shared/types/db';

export type INet = T.ITableNets & T.ITableNetsData;

export type IUserNet = T.ITableNets &
  T.ITableNetsData &
  T.ITableNodes &
  T.ITableMembers;

/* net structure */
export type INetNode = {
  member: T.INodeMember;
  tree: INetNode[] | null;
  connection: boolean;
};
