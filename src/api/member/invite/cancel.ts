import Joi from 'joi';
import { IMemberConfirmParams } from '@root/shared/types/api';
import { THandler } from '../../../controller/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '@shared/server/utils';

const cancel: THandler<IMemberConfirmParams, boolean> = async (
  _,
  { node_id, member_id },
) => {
  const [member] = await execQuery.member.find.inTree([node_id, member_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'INVITED') return false; // bad request
  await execQuery.member.invite.remove([member_id]);
  return true;
};
cancel.paramsSchema = MemberConfirmParamsSchema;
cancel.responseSchema = Joi.boolean();
cancel.checkNet = true;

export = cancel;
