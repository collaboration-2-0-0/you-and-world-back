import Joi from 'joi';
import { IUserNode } from '@root/shared/types/api';
import { THandler } from '../../controller/types';
import { UserNodeSchema } from '../schema/schema';

const leave: THandler<IUserNode> = async ({ member: m }) => {
  const member = m!.get();
  const { confirmed } = member;
  const event_type = confirmed ? 'LEAVE' : 'LEAVE_CONNECTED';
  const remove = domain.net.NetArrange.removeMemberFromNet;
  const { netRemoved, parent_net_id } = await remove(event_type, member);

  if (netRemoved && parent_net_id) {
    await domain.net.updateCountOfNets(parent_net_id, -netRemoved);
  }

  return true;
};
leave.paramsSchema = UserNodeSchema;
leave.responseSchema = Joi.boolean();
leave.allowedForNetUser = 'INVITING';
leave.checkNet = true;

export = leave;
