import { TQuery } from '@db/types';

export interface IQueriesUserMessenger {
  connect: TQuery<[['user_id', number], ['chatId', number]]>;
}

export const connect = `
  UPDATE users
  SET chat_id = $2
  WHERE user_id = $1
`;
