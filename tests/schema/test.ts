import Joi from 'joi';
import { JOI_NULL, JOI_REQUIRED } from '../../src/api/schema/index.schema';

const options = {
  // allowUnknown: true,
  stripUnknown: true,
  // errors: { render: false },
};

const UserUpdateParamsSchema = {
  name: JOI_REQUIRED(Joi.string().empty(''), JOI_NULL),
  mobile: [Joi.string().empty(''), JOI_NULL],
  password: [Joi.string().empty(''), JOI_NULL],
  user_id: Joi.number(),
  email: [Joi.string(), JOI_NULL],
  chat_id: [Joi.string(), JOI_NULL],
  confirmed: Joi.boolean(),
  username: Joi.string(), // .required(),
  photo_url: Joi.string(),
};

const schema = Joi.object(UserUpdateParamsSchema);

const { error, value } = schema.validate({ name: null }, options);

console.dir(error ? { error, details: error.details } : value);
