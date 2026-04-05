import { JOI_NULL } from '@root/api/schema';
import Joi from 'joi';

const options = {
  allowUnknown: true,
  stripUnknown: true,
  errors: { render: false },
};

export const schema = {
  chat_id: Joi.number(),
  text: [Joi.string().empty(''), JOI_NULL],
};

const s = Joi.object(schema);
const result = s.validate({ chat_id: '123', text: null }, options);

console.log(result.value);
console.log('error:', result.error?.details);
