import { ISpace, ISpaceDepth, ISpaceWithDepth } from '../db';
import { Nullable } from './common.types';
import { IUserNode } from './member.types';

export type ISpaceResponse = Nullable<ISpace>;
export type ISpacesResponse = ISpace[];
export type ISpacesWithDepth = ISpaceWithDepth[];
export type ISpaceCreate = Omit<ISpace, 'space_id' | 'space_rel_id'>;
export type ISpaceGet = { space_id: number };
export type ISpaceParent = { parent_space_id: number | null };
export type ISpaceUpdate = ISpaceGet & ISpaceCreate;
export type ISpaceGetTree = ISpaceParent & ISpaceDepth;

/* member */
export type IMemberSpaceReq = IUserNode & { space_rel_id: number };
