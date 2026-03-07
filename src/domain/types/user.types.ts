import { ITableUsers } from '@shared/types/db';

export type IUser = Omit<ITableUsers, 'password'>;
