import { THandler } from '../../controller/types';
import {
  IToken,
  IUserResponse,
  UserStatusKey,
} from '../../shared/server/types/types';
import { TokenSchema, UserResponseSchema } from '../schema/schema';

const confirm: THandler<IToken, IUserResponse> = async (
  { session },
  { token },
) => {
  const [user] = await execQuery.user.findByToken([token]);
  if (!user) return null;
  const { user_id, confirmed } = user;
  await execQuery.user.token.remove([user_id]);
  !confirmed && (await execQuery.user.confirm([user_id]));
  const user_status: UserStatusKey = 'LOGGED_IN';
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user, user_status };
};
confirm.paramsSchema = TokenSchema;
confirm.responseSchema = UserResponseSchema;
confirm.allowedForUser = 'NOT_LOGGED_IN';

export = confirm;
