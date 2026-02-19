import {
  ISignupParams,
  IUserResponse,
  UserStatusKey,
} from '../../client/app/types/types';
import { THandler } from '../../controller/types';
import { SignupParamsSchema, UserResponseSchema } from '../schema/schema';

const signup: THandler<ISignupParams, IUserResponse> = async (
  { session },
  { name, email },
) => {
  const [userExists] = await execQuery.user.findByEmail([email]);
  if (userExists) return null;

  const token = cryptoService.createUnicCode(15);
  const [user] = await execQuery.user.create([name, email]);
  const { user_id } = user!;
  let user_status: UserStatusKey;
  if (env.MAIL_CONFIRM_OFF) {
    user_status = 'LOGGED_IN';
    await execQuery.user.confirm([user_id]);
    user!.confirmed = true;
  } else {
    user_status = 'NOT_CONFIRMED';
    await execQuery.user.token.create([user_id, token]);
    await mailService.confirm(email, token);
  }
  session.write('user_id', user_id);
  session.write('user_status', user_status);
  return { ...user!, user_status };
};
signup.paramsSchema = SignupParamsSchema;
signup.responseSchema = UserResponseSchema;
signup.allowedForUser = 'NOT_LOGGED_IN';

export = signup;
