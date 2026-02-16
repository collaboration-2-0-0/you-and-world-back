import { ITableUsers } from '../../../local/imports';
import { Nullable } from './common.types';
import { IUser, UserStatusKey } from './user.types';
export type IUserResponse = Nullable<IUser & { user_status: UserStatusKey }>;

export type IUserUpdate = Pick<ITableUsers, 'name' | 'mobile' | 'password'>;

/* for tests */
export type ILoginParams = {
  email: string;
  password: string;
};

/* for tests */
export type ISignupParams = {
  name: string;
  email: string;
};
