import { THandler } from '../../controller/types';
import {
  IUserResponse,
  IUserUpdate,
} from '../../client/common/server/types/types';
import { UserResponseSchema, UserUpdateSchema } from '../schema/account.schema';

export const read: THandler<never, IUserResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  const user_status = session.read('user_status')!;
  if (!user_id) return null;
  const [user] = await execQuery.user.get([user_id]);
  return { ...user!, user_status };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGED_IN';

export const update: THandler<IUserUpdate, IUserResponse> = async (
  { session },
  data,
) => {
  const user_id = session.read('user_id')!;
  const user_status = session.read('user_status')!;
  let [user] = await execQuery.user.get([user_id]);
  const newUserData = [
    data.name || null,
    data.mobile || null,
    data.password
      ? await cryptoService.createHash(data.password)
      : user!.password,
  ] as const;
  [user] = await execQuery.user.update([user_id, ...newUserData]);
  return { ...user!, user_status };
};
update.paramsSchema = UserUpdateSchema;
update.responseSchema = UserResponseSchema;
