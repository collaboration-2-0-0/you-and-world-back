import Joi from 'joi';
import {
  ISpacesResponse,
  IMemberSpaceReq,
  IMemberAndNode,
} from '@shared/types/api';
import { THandler } from '@root/controller/types';
import {
  SpacesResponseSchema,
  MemberSpaceReqSchema,
  MemberAndNodeSchema,
} from '../schema';

/* get */
export const get: THandler<IMemberAndNode, ISpacesResponse> = async (
  _,
  { member_id },
) => {
  const spaces = await execQuery.member.space.get([member_id]);
  return spaces;
};
get.paramsSchema = MemberAndNodeSchema;
get.responseSchema = SpacesResponseSchema;
get.checkNet = true;

/* add */
export const add: THandler<IMemberSpaceReq, boolean> = async (
  _,
  { node_id, space_rel_id },
) => {
  await execQuery.member.space.add([node_id, space_rel_id]);
  return true;
};
add.paramsSchema = MemberSpaceReqSchema;
add.responseSchema = Joi.boolean();
add.checkNet = true;

/* remove */
export const remove: THandler<IMemberSpaceReq, boolean> = async (
  _,
  { node_id, space_rel_id },
) => {
  await execQuery.member.space.remove([node_id, space_rel_id]);
  return true;
};
remove.paramsSchema = MemberSpaceReqSchema;
remove.responseSchema = Joi.boolean();
remove.checkNet = true;
