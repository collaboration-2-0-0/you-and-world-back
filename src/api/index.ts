import Joi from 'joi';
import { THandler } from '@root/controller/types';
import { IEmpty } from '@shared/types/api';
import { EmptySchema } from './schema';

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
