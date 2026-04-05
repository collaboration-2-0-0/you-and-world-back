import Joi from 'joi';
import { ITableMembersInfo } from '@shared/types/db';
import { IMemberInfoReq } from '@shared/types/api';
import { TJoiSchema } from '@root/controller/types';
import { JOI_NULL } from './common.schema';
import { UserNodeSchema } from './member.schema';

export const MemberInfoReqSchema = {
  ...UserNodeSchema,
  member_id: Joi.number(),
  member_desire: [Joi.string().empty(''), JOI_NULL],
  member_goal: [Joi.string().empty(''), JOI_NULL],
  member_activity: [Joi.string().empty(''), JOI_NULL],
  member_role: [Joi.string().empty(''), JOI_NULL],
} as Record<keyof IMemberInfoReq, TJoiSchema>;

export const MemberInfoResSchema = [
  JOI_NULL,
  {
    member_id: Joi.number(),
    member_desire: [Joi.string(), JOI_NULL],
    member_goal: [Joi.string(), JOI_NULL],
    member_activity: [Joi.string(), JOI_NULL],
    member_role: [Joi.string(), JOI_NULL],
  } as Record<keyof ITableMembersInfo, TJoiSchema>,
];
