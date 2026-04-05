import { ITableMembersInfo } from '../db';
import { IUserNode } from './member.types';
import { Nullable } from './common.types';

export type IMemberInfoReq = IUserNode & Partial<ITableMembersInfo>;

export type IMemberInfoRes = Nullable<ITableMembersInfo>;
