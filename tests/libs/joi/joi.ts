import Joi from 'joi';

const options = {
  allowUnknown: true,
  stripUnknown: true,
  errors: { render: false },
};

export const schema = {
  chat_id: Joi.number(),
};

const s = Joi.object(schema);
const result = s.validate({ chat_id: '123' }, options);

console.log(result);
