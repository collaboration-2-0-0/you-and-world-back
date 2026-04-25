import Joi from 'joi';
import { ISpace, ISpaceDepth } from '@root/shared/types/db';
import {
  ISpaceCreate,
  ISpaceUpdate,
  ISpaceGet,
  IMemberSpaceReq,
  ISpaceParent,
  ISpacesWithDepth,
  ISpaceGetTree,
} from '@shared/types/api';
import { JOI_NULL } from './common.schema';
import { TJoiSchema } from '@root/controller/types';
import { UserNodeSchema } from './member.schema';

export const SpaceSchema = {
  space_id: Joi.number(),
  space_rel_id: Joi.number(),
  parent_space_id: [Joi.number(), JOI_NULL],
  name: Joi.string(),
  description: [Joi.string(), JOI_NULL],
};

export const SpaceResponseSchema = [
  JOI_NULL,
  SpaceSchema as Record<keyof ISpace, TJoiSchema>,
];

export const SpacesResponseSchema = { ...SpaceSchema };

export const SpaceCreateSchema = {
  name: Joi.string().required(),
  description: [Joi.string().empty(''), JOI_NULL],
  parent_space_id: [Joi.number(), JOI_NULL],
} as Record<keyof ISpaceCreate, TJoiSchema>;

export const SpaceGetSchema = {
  space_id: Joi.number().required(),
} as Record<keyof ISpaceGet, TJoiSchema>;

export const SpaceUpdateSchema = {
  ...SpaceGetSchema,
  name: Joi.string().required(),
  description: [Joi.string().empty(''), JOI_NULL],
  parent_space_id: [Joi.number(), JOI_NULL],
} as Record<keyof ISpaceUpdate, TJoiSchema>;

export const SpaceParentSchema = {
  parent_space_id: [Joi.number(), JOI_NULL],
} as Record<keyof ISpaceParent, TJoiSchema>;

export const SpaceDepthSchema = {
  depth: [Joi.number().integer().min(0), JOI_NULL],
} as Record<keyof ISpaceDepth, TJoiSchema>;

export const SpacesWithDepthSchema = {
  ...SpaceSchema,
  ...SpaceDepthSchema,
} as Record<keyof ISpacesWithDepth[number], TJoiSchema>;

export const SpaceGetTreeSchema = {
  ...SpaceParentSchema,
  ...SpaceDepthSchema,
} as Record<keyof ISpaceGetTree, TJoiSchema>;

/* member */
export const SpaceRelSchema = {
  space_rel_id: Joi.number().required(),
};

export const MemberSpaceReqSchema = {
  ...UserNodeSchema,
  ...SpaceRelSchema,
} as Record<keyof IMemberSpaceReq, TJoiSchema>;
