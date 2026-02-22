import Joi from 'joi';
import { THandler } from '../controller/types';
import { IEmpty } from '@root/shared/types/api';
import { EmptySchema } from './schema/schema';

export const health: THandler<never, string> = async () => 'API IS READY';
health.responseSchema = Joi.string();
health.allowedForUser = 'NOT_LOGGED_IN';

export const echo: THandler<IEmpty, IEmpty> = async (_, data) => {
  logger.debug('', data);
  return data;
};
echo.paramsSchema = EmptySchema;
echo.responseSchema = EmptySchema;
echo.allowedForUser = 'NOT_LOGGED_IN';
