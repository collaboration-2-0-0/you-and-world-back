import { ITableMessages } from '@domain/types';
import { TQuery } from '../../types/types';

// const INTERVAL = +(process.env.NOTIFICATION_INTERVAL || 0);

export interface IQueriesMessage {
  get: TQuery<[['net_id', number], ['subject', string]], ITableMessages>;
  update: TQuery<
    [
      ['net_id', number],
      ['message_id', number],
      ['subject', string],
      ['content', string],
      ['date', Date],
    ],
    ITableMessages
  >;
  removeById: TQuery<[['message_id', number]]>;
  // remove: TQuery<[['net_id', number], ['subject', string]]>;
  // removeOld: TQuery<[['net_id', number]]>;
}

export const get = `
  SELECT *
  FROM messages
  WHERE
    net_id = $1 AND
    subject = $2
  ORDER BY date;
`;

export const update = `
  INSERT INTO messages AS m (
    net_id,
    message_id,
    subject,
    content,
    date
  )
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (message_id)
    DO UPDATE
    SET
      content = $4,
      date = $5
  WHERE
    m.message_id = $2
  RETURNING *;
`;

export const removeById = `
  DELETE
  FROM messages
  WHERE message_id = $1;
`;

// export const remove = `
//   DELETE
//   FROM messages
//   WHERE
//     net_id = $1 AND
//     subject = $2;
// `;

// export const removeOld = `
//   DELETE FROM messages
//   WHERE
//     net_id = $1 AND
//     date + interval '${INTERVAL * 4} second'< now();
// `;
