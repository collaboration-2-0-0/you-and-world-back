import Joi from 'joi';
import { THandler } from '@root/controller/types';
import { IMemberConfirmParams } from '@shared/types/api';
import { getMemberStatus } from '@shared/server/utils';
import { MemberConfirmParamsSchema } from '../../schema';

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
