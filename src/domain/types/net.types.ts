import * as T from '@shared/types/db';

export type INetCreate = Pick<T.ITableNetsData, 'name' | 'rules'>;

/* net structure */
export type INetNode = {
  member: T.INodeMember;
  tree: INetNode[] | null;
  connection: boolean;
};
