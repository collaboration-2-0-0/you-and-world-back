import Joi from 'joi';
import { THandler } from '@root/controller/types';
import {
  IGetSubscription,
  IRemoveSubscription,
  IUpdateSubscription,
  IUserNode,
} from '@shared/types/api';
import {
  GetSubscriptionSchema,
  UpdateSubscriptionSchema,
  RemoveSubscriptionSchema,
  UserNodeSchema,
} from '../schema';

/* read */
export const get: THandler<IUserNode, IGetSubscription> = async ({
  member,
}) => {
  const { member_id } = member!.get();
  const subscriptions = await execQuery.subscription.get([member_id]);
  return subscriptions as IGetSubscription;
};
get.paramsSchema = UserNodeSchema;
get.responseSchema = GetSubscriptionSchema;
get.checkNet = true;

/* create / update */
export const update: THandler<IUpdateSubscription, boolean> = async (
  { member },
  { type, subject },
) => {
  const { member_id } = member!.get();
  await execQuery.subscription.update([member_id, type, subject]);
  return true;
};
update.paramsSchema = UpdateSubscriptionSchema;
update.responseSchema = Joi.boolean();
update.checkNet = true;

/* delete */
export const remove: THandler<IRemoveSubscription, boolean> = async (
  { member },
  { subject },
) => {
  const { member_id } = member!.get();
  await execQuery.subscription.remove([member_id, subject]);
  return true;
};
remove.paramsSchema = RemoveSubscriptionSchema;
remove.responseSchema = Joi.boolean();
remove.checkNet = true;
