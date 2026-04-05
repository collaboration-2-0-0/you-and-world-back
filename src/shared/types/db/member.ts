import {
  OuterJoin,
  ITableMembers,
  ITableMembersInvites,
  ITableNodes,
  ITableUsers,
} from './index';

export type IMember = ITableMembers & ITableUsers & ITableNodes;

export type INodeMemberOrInvite = ITableNodes &
  OuterJoin<IMember & ITableMembersInvites>;
