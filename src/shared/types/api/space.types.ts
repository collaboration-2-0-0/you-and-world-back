import { ITableSpaces, ITableSpacesToSpaces } from '../db';
import { Nullable } from './common.types';

export type ISpaceResponse = Nullable<ITableSpaces & ITableSpacesToSpaces>;
export type ISpacesResponse = (ITableSpaces & ITableSpacesToSpaces)[];
export type ISpaceWithDepthResponse = (ITableSpaces & ITableSpacesToSpaces & { depth: number })[];

export type ISpaceCreateParams = {
  name: string;
  description?: string | null;
  parent_space_id?: number | null;
};

export type ISpaceUpdateParams = {
  space_id: number;
  name: string;
  description?: string | null;
  parent_space_id?: number | null;
};

export type ISpaceGetParams = {
  space_id: number;
};

export type ISpaceRemoveParams = {
  space_id: number;
};

export type ISpacesByParentParams = {
  parent_space_id: number | null;
};

export type ISpaceWithParentsParams = {
  space_id: number;
};
