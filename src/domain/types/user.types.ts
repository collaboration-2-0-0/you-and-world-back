import { ITableUsers } from './db.types';

export type IUser = Omit<ITableUsers, 'password'>;
