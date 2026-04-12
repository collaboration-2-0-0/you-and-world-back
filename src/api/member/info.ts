import { THandler } from '@root/controller/types';
import {
  IMemberAndNode,
  IMemberInfoReq,
  IMemberInfoRes,
} from '@shared/types/api';
import {
  MemberAndNodeSchema,
  MemberInfoReqSchema,
  MemberInfoResSchema,
} from '../schema';

export const read: THandler<IMemberAndNode, IMemberInfoRes> = async (
  { member: m },
  { node_id, member_id },
) => {
  let isAllowed = node_id === member_id;

  if (!isAllowed) {
    const [member] = await execQuery.member.find.inTree([node_id, member_id]);
    isAllowed = Boolean(member);
  }

  if (!isAllowed) {
    /* if user in root node  */
    const { parent_node_id } = m!.get();
    if (!parent_node_id) {
      return null; // bad request
    }
    const [member] = await execQuery.member.find.inCircle([
      parent_node_id,
      member_id,
    ]);
    if (!member) {
      return null; // bad request
    }
  }

  const [info] = await execQuery.member.info.get([member_id]);

  return (
    info || {
      member_id,
      member_desire: null,
      member_goal: null,
      member_activity: null,
      member_role: null,
    }
  );
};
read.paramsSchema = MemberAndNodeSchema;
read.responseSchema = MemberInfoResSchema;
read.checkNet = true;

export const update: THandler<IMemberInfoReq, IMemberInfoRes> = async (
  _,
  {
    node_id,
    member_id,
    member_desire,
    member_goal,
    member_activity,
    member_role,
  },
) => {
  if (node_id !== member_id) {
    return null; // bad request
  }

  let [info] = await execQuery.member.info.get([node_id]);

  if (!info) {
    [info] = await execQuery.member.info.create([
      node_id,
      member_desire || null,
      member_goal || null,
      member_activity || null,
      member_role || null,
    ]);

    return info || null;
  }

  [info] = await execQuery.member.info.update([
    node_id,
    member_desire !== undefined ? member_desire || null : info.member_desire,
    member_goal !== undefined ? member_goal || null : info.member_goal,
    member_activity !== undefined
      ? member_activity || null
      : info.member_activity,
    member_role !== undefined ? member_role || null : info.member_role,
  ]);

  return info || null;
};
update.paramsSchema = MemberInfoReqSchema;
update.responseSchema = MemberInfoResSchema;
update.checkNet = true;
