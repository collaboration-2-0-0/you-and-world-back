import Joi from 'joi';
import { TJoiSchema } from '@root/controller/types';
import { IUserNetDataResponse } from '@shared/types/api';
import { JOI_NULL } from './common.schema';

export const UserNetDataResponseSchema = {
  node_id: Joi.number(),
  parent_node_id: [Joi.number(), JOI_NULL],
  confirmed: [Joi.boolean(), JOI_NULL],
  count_of_members: Joi.number(),
  vote: [Joi.boolean(), JOI_NULL],
  vote_count: Joi.number(),
} as Record<keyof IUserNetDataResponse, TJoiSchema>;
