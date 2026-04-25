import { THandler } from '@root/controller/types';
import {
  ISpaceParent,
  ISpacesResponse,
  ISpaceGet,
  ISpacesWithDepth,
  ISpaceGetTree,
} from '@shared/types/api';
import {
  SpaceParentSchema,
  SpacesResponseSchema,
  SpaceGetSchema,
  SpacesWithDepthSchema,
  SpaceGetTreeSchema,
} from '../schema';

export const getByParent: THandler<ISpaceParent, ISpacesResponse> = async (
  _,
  { parent_space_id },
) => {
  if (!parent_space_id) {
    return execQuery.space.tree.getRoots([]);
  }
  return execQuery.space.tree.getByParent([parent_space_id]);
};
getByParent.paramsSchema = SpaceParentSchema;
getByParent.responseSchema = SpacesResponseSchema;

export const getBySpace: THandler<ISpaceGet, ISpacesWithDepth> = async (
  _,
  { space_id },
) => execQuery.space.tree.getWithParents([space_id]);
getBySpace.paramsSchema = SpaceGetSchema;
getBySpace.responseSchema = SpacesWithDepthSchema;

export const getTree: THandler<ISpaceGetTree, ISpacesWithDepth> = async (
  _,
  { parent_space_id, depth },
) => execQuery.space.tree.getTree([parent_space_id ?? null, depth ?? null]);
getTree.paramsSchema = SpaceGetTreeSchema;
getTree.responseSchema = SpacesWithDepthSchema;
