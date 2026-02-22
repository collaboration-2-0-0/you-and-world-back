import {
  ITableMembersInvites,
  ITableMembersToMembers,
  ITableNodes,
  OuterJoin,
  IMember,
} from '../../local/imports';

export type IUserNode = { node_id: number };

export type IMemberNode = { member_id: number };

export type IMemberConfirmParams = IUserNode & IMemberNode;

export type IMemberInviteParams = IMemberConfirmParams & {
  member_name: string;
};

export type IMemberResponse = ITableNodes &
  OuterJoin<Omit<IMember, 'password'>> &
  OuterJoin<ITableMembersInvites> &
  OuterJoin<ITableMembersToMembers> & {
    vote_count: number;
  };

export const MEMBER_STATUS = [
  'UNAVAILABLE',
  'EMPTY',
  'FREE',
  'INVITED',
  'CONNECTED',
  'ACTIVE',
] as const;

export type MemberStatusKeys = (typeof MEMBER_STATUS)[number];
