import { OuterJoin, ITableMembersToMembers, INodeMemberOrInvite } from '../db';

export type IUserNode = { node_id: number };
export type IMemberNode = { member_id: number };
export type IMemberAndNode = IUserNode & IMemberNode;
export type IMemberInviteParams = IMemberAndNode & {
  member_name: string;
};

export type IMemberResponse = Omit<INodeMemberOrInvite, 'password'> &
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
