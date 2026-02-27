import Joi from 'joi';
import { UserNodeSchema } from './member.schema';

export const SubscriptionSchema = {
  type: Joi.string().required(),
  subject: Joi.string().required(),
};
export const GetSubscriptionSchema = {
  ...SubscriptionSchema,
};

export const UpdateSubscriptionSchema = {
  ...UserNodeSchema,
  ...SubscriptionSchema,
};

export const RemoveSubscriptionSchema = {
  ...UserNodeSchema,
  type: Joi.string(),
  subject: Joi.string(),
};
