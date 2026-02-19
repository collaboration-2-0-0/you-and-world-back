import Joi, { AnySchema } from 'joi';

export const JOI_NULL = Joi.any().equal(null);
export const JOI_REQUIRED = (...schemaArr: AnySchema[]) =>
  Joi.alternatives()
    .try(...schemaArr)
    .required();

export const EmptySchema = {};

export const TokenSchema = {
  token: Joi.string().required(),
};
