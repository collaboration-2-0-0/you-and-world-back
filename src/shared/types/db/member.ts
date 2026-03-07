import {
  ITableMembers,
  ITableMembersInvites,
  ITableNodes,
  ITableUsers,
} from './index';

export type IMember = ITableMembers & ITableUsers & ITableNodes;
export type IMemberInvites = IMember & ITableMembersInvites;
