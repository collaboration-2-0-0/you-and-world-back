// import Joi from 'joi';
// import { THandler } from '@root/controller/types';
// import {
//   ISpaceCreateParams,
//   ISpaceUpdateParams,
//   ISpaceGetParams,
//   ISpaceRemoveParams,
//   ISpaceResponse,
// } from '@shared/types/api';
// import {
//   SpaceCreateSchema,
//   SpaceUpdateSchema,
//   SpaceGetSchema,
//   SpaceRemoveSchema,
//   SpaceResponseSchema,
// } from '../schema';

// export const create: THandler<ISpaceCreateParams, ISpaceResponse> = async (
//   _,
//   { name, description, parent_space_id },
// ) => {
//   const [space] = await execQuery.space.create([
//     name,
//     description ?? null,
//     parent_space_id ?? null,
//   ]);
//   return space ?? null;
// };
// create.paramsSchema = SpaceCreateSchema;
// create.responseSchema = SpaceResponseSchema;

// export const read: THandler<ISpaceGetParams, ISpaceResponse> = async (
//   _,
//   { space_id },
// ) => {
//   const [space] = await execQuery.space.get([space_id]);
//   return space ?? null;
// };
// read.paramsSchema = SpaceGetSchema;
// read.responseSchema = SpaceResponseSchema;

// export const update: THandler<ISpaceUpdateParams, ISpaceResponse> = async (
//   _,
//   { space_id, name, description, parent_space_id },
// ) => {
//   const [space] = await execQuery.space.update([
//     space_id,
//     name,
//     description ?? null,
//   ]);
//   if (!space) return null;
//   const [sts] = await execQuery.space.get([space_id]);
//   if (parent_space_id !== undefined && sts) {
//     await execQuery.space.tree.updateParent([sts.space_rel_id, parent_space_id ?? null]);
//   }
//   const [updated] = await execQuery.space.get([space_id]);
//   return updated ?? null;
// };
// update.paramsSchema = SpaceUpdateSchema;
// update.responseSchema = SpaceResponseSchema;

// export const remove: THandler<ISpaceRemoveParams, boolean> = async (
//   _,
//   { space_id },
// ) => {
//   await execQuery.space.remove([space_id]);
//   return true;
// };
// remove.paramsSchema = SpaceRemoveSchema;
// remove.responseSchema = Joi.boolean();
