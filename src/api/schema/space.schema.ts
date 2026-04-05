// import Joi from 'joi';
// import { TJoiSchema } from '@root/controller/types';
// import {
//   ISpaceCreateParams,
//   ISpaceUpdateParams,
//   ISpaceGetParams,
//   ISpaceRemoveParams,
//   ISpacesByParentParams,
//   ISpaceWithParentsParams,
//   ISpaceResponse,
//   OmitNull,
// } from '@shared/types/api';
// import { JOI_NULL } from './common.schema';

// const SpaceObjectSchema = {
//   space_id: Joi.number(),
//   space_rel_id: Joi.number(),
//   parent_space_id: [Joi.number(), JOI_NULL],
//   name: Joi.string(),
//   description: [Joi.string(), JOI_NULL],
// };

// export const SpaceResponseSchema = [
//   JOI_NULL,
//   SpaceObjectSchema as Record<keyof OmitNull<ISpaceResponse>, TJoiSchema>,
// ];

// export const SpacesResponseSchema = SpaceObjectSchema as Record<
//   string,
//   TJoiSchema
// >;

// export const SpaceCreateSchema = {
//   name: Joi.string().required(),
//   description: [Joi.string().empty(''), JOI_NULL],
//   parent_space_id: [Joi.number(), JOI_NULL],
// } as Record<keyof ISpaceCreateParams, TJoiSchema>;

// export const SpaceUpdateSchema = {
//   space_id: Joi.number().required(),
//   name: Joi.string().required(),
//   description: [Joi.string().empty(''), JOI_NULL],
//   parent_space_id: [Joi.number(), JOI_NULL],
// } as Record<keyof ISpaceUpdateParams, TJoiSchema>;

// export const SpaceGetSchema = {
//   space_id: Joi.number().required(),
// } as Record<keyof ISpaceGetParams, TJoiSchema>;

// export const SpaceRemoveSchema = {
//   space_id: Joi.number().required(),
// } as Record<keyof ISpaceRemoveParams, TJoiSchema>;

// export const SpacesByParentSchema = {
//   parent_space_id: [Joi.number(), JOI_NULL],
// } as Record<keyof ISpacesByParentParams, TJoiSchema>;

// export const SpaceWithParentsSchema = {
//   space_id: Joi.number().required(),
// } as Record<keyof ISpaceWithParentsParams, TJoiSchema>;
