import { ITableSubscriptions } from '@shared/types/db';
import { TQuery } from '@db/types';
import { IQueriesSubscriptionSend } from './send';

export interface IQueriesSubscription {
  get: TQuery<[['member_id', number]], ITableSubscriptions>;
  update: TQuery<
    [['member_id', number], ['type', string], ['subject', string]]
  >;
  remove: TQuery<[['member_id', number], ['subject', string | undefined]]>;
  send: IQueriesSubscriptionSend;
}

export const get = `
  SELECT * FROM subscriptions
  WHERE member_id = $1;
`;

export const update = `
  INSERT INTO subscriptions AS ss (
    member_id,
    type,
    subject
  )
  VALUES ($1, $2, $3)
  ON CONFLICT (member_id, subject)
    DO UPDATE
    SET
      type = $2
    WHERE
      ss.member_id = $1 AND
      ss.subject = $3
`;

export const remove = `
  DELETE FROM subscriptions
  WHERE
    member_id = $1 AND (
      $2::varchar ISNULL OR
      subject = $2
    );
`;
