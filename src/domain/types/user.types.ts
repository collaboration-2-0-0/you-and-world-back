import { ITableUsers } from '@types-db/db.types';

export type IUser = Omit<ITableUsers, 'password'>;
