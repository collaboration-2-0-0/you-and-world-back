import Joi from 'joi';
import { IUserNetDataResponse } from '@shared/types/api';
import { TJoiSchema } from '@root/controller/types';
import { JOI_NULL } from './common.schema';
import { MemberSchema } from './member.schema';

export const UserNetDataResponseSchema = {
  ...MemberSchema,
  vote: [Joi.boolean(), JOI_NULL],
  vote_count: Joi.number(),
} as Record<keyof IUserNetDataResponse, TJoiSchema>;
