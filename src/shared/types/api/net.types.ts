import {
  ITableMembers,
  ITableMembersToMembers,
  INet,
  ITableNets,
  ITableNetsData,
  ITableNodes,
  ITableNetsGuests,
  ITableUsers,
  OuterJoin,
  NetViewKeys,
} from '../../local/imports';
import { IMemberResponse, IUserNode, Nullable } from './index';

export type INetCreateParams = Pick<ITableNetsData, 'name'> & {
  node_id: number | null;
};

export type INetEnterParams = { net_id: number };

export type INetUpdateParams = IUserNode & { goal: string };

export type INetData = ITableNets & ITableNetsData & ITableNodes;

export type INetResponse = Nullable<
  INetData & { total_count_of_members: number }
>;
export type INetsResponse = INetData[];

export type INetViewResponse = IMemberResponse[];

export type NetViewEnum = Exclude<NetViewKeys, 'net'>;

export type IUserNetDataResponse = Pick<
  ITableNodes,
  'node_id' | 'parent_node_id' | 'count_of_members'
> &
  Pick<ITableMembers, 'confirmed'> &
  OuterJoin<Pick<ITableMembersToMembers, 'vote'>> & { vote_count: number };

export type INetConnectByToken = {
  net_id: number;
  error?: 'already member or connected' | 'not parent net member';
} | null;

export type INetConnectByLink = {
  net_id: number;
  error?:
    | 'already waiting'
    | 'already member or connected'
    | 'not parent net member';
} | null;

export type IWaitCreateParams = {
  token: string;
  comment: string;
  test: boolean;
};

export type IWaitNets = Pick<INet, 'net_id' | 'name'>[];

export type INetWaiting = Pick<
  ITableUsers,
  'user_id' | 'name' | 'chat_id' | 'username'
> &
  Pick<ITableNetsGuests, 'comment'>;
export type INetWaitingResponse = INetWaiting[];

export type INetInviteParams = {
  node_id: number;
  user_id: number;
};
