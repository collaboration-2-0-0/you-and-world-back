import Joi from 'joi';
import { THandler } from '@root/controller/types';

const handler: THandler<never, boolean> = async ({ isAdmin }) => {
  if (!isAdmin) {
    return false;
  }
  logger.debug({ 'subscription.sending.handler': 'send messages on start' });
  // new domain.events.Events().sendMessage('URGENT');
  // new domain.events.Events().sendMessage('REPORT');
  return true;
};
handler.responseSchema = Joi.boolean();

export = handler;
