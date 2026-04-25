import Joi from 'joi';
import {
  ISpaceCreate,
  ISpaceUpdate,
  ISpaceGet,
  ISpaceResponse,
} from '@shared/types/api';
import { ISpace } from '@root/shared/types/db';
import { THandler } from '@root/controller/types';
import {
  SpaceCreateSchema,
  SpaceUpdateSchema,
  SpaceGetSchema,
  SpaceSchema,
  SpaceResponseSchema,
} from '@root/api/schema';

export const read: THandler<ISpaceGet, ISpaceResponse> = async (
  _,
  { space_id },
) => {
  const [space] = await execQuery.space.get([space_id]);
  return space ?? null;
};
read.paramsSchema = SpaceGetSchema;
read.responseSchema = SpaceResponseSchema;
read.allowedForUser = 'NOT_LOGGED_IN';

export const create: THandler<ISpaceCreate, ISpace> = async (
  _,
  { name, description, parent_space_id },
) => {
  const [space] = await execQuery.space.create([
    name,
    description ?? null,
    parent_space_id ?? null,
  ]);
  return space!;
};
create.paramsSchema = SpaceCreateSchema;
create.responseSchema = SpaceSchema;
create.allowedForUser = 'NOT_LOGGED_IN';

export const update: THandler<ISpaceUpdate, ISpaceResponse> = async (
  _,
  { space_id, name, description, parent_space_id },
) => {
  /* todo pass spacce_rel_id as any space can has a few parents */
  /* spaces */
  const [space] = await execQuery.space.update([
    space_id,
    name,
    description ?? null,
  ]);

  if (!space) {
    return null;
  }

  /* spaces_to_spaces */
  const [sts] = await execQuery.space.get([space_id]);
  if (parent_space_id !== undefined && sts) {
    await execQuery.space.tree.updateParent([
      sts.space_rel_id,
      parent_space_id ?? null,
    ]);
  }

  const [updated] = await execQuery.space.get([space_id]);
  return updated!;
};
update.paramsSchema = SpaceUpdateSchema;
update.responseSchema = SpaceResponseSchema;
update.allowedForUser = 'NOT_LOGGED_IN';

export const remove: THandler<ISpaceGet, boolean> = async (_, { space_id }) => {
  /* todo do not remove space if there are any member with it */
  await execQuery.space.remove([space_id]);
  return true;
};
remove.paramsSchema = SpaceGetSchema;
remove.responseSchema = Joi.boolean();
remove.allowedForUser = 'NOT_LOGGED_IN';
