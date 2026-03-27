import {
  ITableNetsGuests,
  ITableUsers,
  NetViewKeys,
  INetData,
  INet,
  INetDataExtended,
  IUserNetData,
} from '../db';
import { IMemberResponse, INetCreate, IUserNode, Nullable } from './index';

export type INetCreateParams = Pick<INetCreate, 'name'> & {
  node_id: number | null;
};

export type INetEnterParams = { net_id: number };

export type INetUpdateParams = IUserNode &
  Partial<{ goal: string; rules: string }>;

export type INetResponse = Nullable<INetDataExtended>;
export type INetsResponse = INetData[];

export type INetViewResponse = IMemberResponse[];

export type NetViewEnum = Exclude<NetViewKeys, 'net'>;

export type IUserNetDataResponse = Pick<
  IUserNetData,
  | 'node_id'
  | 'parent_node_id'
  | 'count_of_members'
  | 'confirmed'
  | 'vote'
  | 'vote_count'
>;

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
