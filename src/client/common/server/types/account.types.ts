import { ITableUsers } from '../../../local/imports';
import { IUser } from './user.types';

export type IUserResponse = IUser | null;

export type IUserUpdateParams = Pick<
  ITableUsers,
  'name' | 'mobile' | 'password'
>;

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
