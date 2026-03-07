import { ITableMembers, ITableNodes } from './tables';
import { OuterJoin } from './utils';

export const NET_VIEW_MAP = ['net', 'tree', 'circle'] as const;
export type NetViewKeys = (typeof NET_VIEW_MAP)[number];

/* net structure */
export type INodeMember = ITableNodes &
  OuterJoin<ITableMembers> & {
    invite: boolean;
    dislikes: number;
    votes: number;
  };
