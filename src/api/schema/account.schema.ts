import Joi from 'joi';
import {
  IUserResponse,
  OmitNull,
} from '../../client/common/server/types/types';
import { TJoiSchema } from '../../controller/types';
import { JOI_NULL } from './index.schema';

export const UserResponseSchema = [
  JOI_NULL,
  {
    user_id: Joi.number(),
    email: [Joi.string(), JOI_NULL],
    name: [Joi.string(), JOI_NULL],
    mobile: [Joi.string(), JOI_NULL],
    user_status: Joi.string(),
    chat_id: [Joi.string(), JOI_NULL],
  } as Record<keyof OmitNull<IUserResponse>, TJoiSchema>,
];

/* for tests */
export const SignupParamsSchema = {
  email: Joi.string().required().email(),
  name: Joi.string().required(),
};

/* for tests */
export const LoginParamsSchema = {
  email: Joi.string().required().email(),
  password: Joi.string().required(),
};

export const EnterParamsSchema = {
  email: Joi.string().required().email(),
};

export const UserUpdateSchema = {
  name: [Joi.string().empty(''), JOI_NULL],
  mobile: [Joi.string().empty(''), JOI_NULL],
  password: [Joi.string().empty(''), JOI_NULL],
};

export const MessengerLinkConnectParamsSchema = {
  chatId: Joi.string().required(),
  token: Joi.string().required(),
};

export const TokenParamsSchema = {
  token: Joi.string().required(),
};
