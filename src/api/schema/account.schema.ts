import Joi from 'joi';
import { IUserResponse, OmitNull } from '@shared/types';
import { TJoiSchema } from '../../controller/types';
import { JOI_NULL } from './common.schema';

export const UserResponseSchema = [
  JOI_NULL,
  {
    user_id: Joi.number(),
    email: [Joi.string(), JOI_NULL],
    name: [Joi.string(), JOI_NULL],
    mobile: [Joi.string(), JOI_NULL],
    confirmed: Joi.boolean(),
    chat_id: [Joi.string(), JOI_NULL],
    username: [Joi.string(), JOI_NULL],
    photo_url: [Joi.string(), JOI_NULL],
    user_status: Joi.string(),
  } as Record<keyof OmitNull<IUserResponse>, TJoiSchema>,
];

export const UserUpdateSchema = {
  user_id: Joi.number().integer().positive(),
  email: [Joi.string().empty(''), JOI_NULL],
  name: [Joi.string().empty(''), JOI_NULL],
  mobile: [Joi.string().empty(''), JOI_NULL],
  confirmed: Joi.boolean(),
  chat_id: [Joi.string().empty(''), JOI_NULL],
  password: [Joi.string().empty(''), JOI_NULL],
  username: [Joi.string().empty(''), JOI_NULL],
  photo_url: [Joi.string().empty(''), JOI_NULL],
};

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

// export const EnterParamsSchema = {
//   email: Joi.string().required().email(),
// };

// export const MessengerLinkConnectParamsSchema = {
//   chatId: Joi.string().required(),
//   token: Joi.string().required(),
// };
