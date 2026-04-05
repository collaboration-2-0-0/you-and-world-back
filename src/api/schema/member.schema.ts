import Joi from 'joi';
import { TJoiSchema } from '@root/controller/types';
import {
  IMemberAndNode,
  IMemberInviteParams,
  IMemberResponse,
} from '@shared/types/api';
import { JOI_NULL } from './common.schema';
import { NodeSchema } from './node.schema';

export const UserNodeSchema = {
  node_id: Joi.number().required(),
};

export const MemberNodeSchema = {
  member_id: Joi.number().required(),
};

export const MemberSchema = {
  confirmed: [Joi.boolean(), JOI_NULL],
};

export const MemberAndNodeSchema = {
  ...UserNodeSchema,
  ...MemberNodeSchema,
} as Record<keyof IMemberAndNode, TJoiSchema>;

export const MemberInviteParamsSchema = {
  ...MemberAndNodeSchema,
  member_name: Joi.string().required(),
} as Record<keyof IMemberInviteParams, TJoiSchema>;

export const MemberResponseSchema = {
  ...NodeSchema,
  ...MemberSchema,
  /* user */
  user_id: [Joi.number(), JOI_NULL],
  name: [Joi.string(), JOI_NULL],
  photo_url: [Joi.string(), JOI_NULL],
  /* invite */
  token: [Joi.string(), JOI_NULL],
  member_name: [Joi.string(), JOI_NULL],
  /* member to member */
  dislike: [Joi.boolean(), JOI_NULL],
  vote: [Joi.boolean(), JOI_NULL],
  vote_count: Joi.number(),
} as Record<keyof IMemberResponse, TJoiSchema>;
