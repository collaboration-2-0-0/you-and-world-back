import { THandler } from '@root/controller/types';
import { IWaitNets, INetsResponse } from '@shared/types/api';
import { NetsResponseSchema, WaitNetsSchema } from '../../schema';

export const all: THandler<never, INetsResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  const nets = await execQuery.user.nets.getAll([user_id!]);
  return nets;
};
all.responseSchema = NetsResponseSchema;

export const wait: THandler<never, IWaitNets> = async ({ session }) => {
  const user_id = session.read('user_id');
  const nets = await execQuery.user.nets.getWait([user_id!]);
  return nets;
};
wait.responseSchema = WaitNetsSchema;
