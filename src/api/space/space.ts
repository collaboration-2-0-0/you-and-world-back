// import { THandler } from '@root/controller/types';
// import {
//   ISpacesByParentParams,
//   ISpaceWithParentsParams,
//   ISpacesResponse,
//   ISpaceWithDepthResponse,
// } from '@shared/types/api';
// import {
//   SpacesByParentSchema,
//   SpaceWithParentsSchema,
//   SpacesResponseSchema,
// } from '../schema';

// export const getByParent: THandler<ISpacesByParentParams, ISpacesResponse> =
//   async (_, { parent_space_id }) => {
//     if (parent_space_id === null || parent_space_id === undefined) {
//       return execQuery.space.tree.getRoots([]);
//     }
//     return execQuery.space.tree.getByParent([parent_space_id]);
//   };
// getByParent.paramsSchema = SpacesByParentSchema;
// getByParent.responseSchema = SpacesResponseSchema;

// export const getBySpace: THandler<
//   ISpaceWithParentsParams,
//   ISpaceWithDepthResponse
// > = async (_, { space_id }) => {
//   return execQuery.space.tree.getWithParents([space_id]);
// };
// getBySpace.paramsSchema = SpaceWithParentsSchema;
// getBySpace.responseSchema = SpacesResponseSchema;
