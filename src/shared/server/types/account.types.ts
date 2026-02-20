import { IUser } from '../../local/imports';
import { Nullable } from './common.types';

export const USER_STATUS_MAP = {
  NOT_LOGGED_IN: 0,
  NOT_CONFIRMED: 1,
  LOGGED_IN: 2,
  /* 'WAITING': 3, */
  INVITING: 3,
  INSIDE_NET: 4,
  DEV: Infinity,
};
export type UserStatusKey = keyof typeof USER_STATUS_MAP;

export type IUserResponse = Nullable<IUser & { user_status: UserStatusKey }>;

export type IUserUpdate = Partial<IUser & { password: string }>;

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
