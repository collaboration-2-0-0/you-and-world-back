import { ITableUsers } from '@shared/types/db';
import { TQuery } from '@db/types';

// const INTERVAL = +(process.env.NOTIFICATION_INTERVAL || 0);

export interface IQueriesSubscriptionSend {
  toUsers: TQuery<
    [['net_id', number], ['subject', string], ['message_date', Date]],
    ITableUsers
  >;
  register: TQuery<
    [['subject', string], ['member_id', number], ['message_date', Date]]
  >;
}

// export const toUsers = `
//   SELECT * FROM users u
//   JOIN subscriptions ss ON
//     ss.user_id  = u.user_id
//   WHERE
//     ss.subject = $1 AND

//     CASE
//       WHEN ss.type = 'ONE_WEEK' THEN now() > ss.sent_date + interval '${INTERVAL} seconds'
//       ELSE CASE
//         WHEN ss.type = 'TWO_WEEK' THEN now() > ss.sent_date + interval '${INTERVAL * 2} seconds'
//         ELSE CASE
//           WHEN ss.type = 'ONE_MONTH' THEN now() > ss.sent_date + interval '${INTERVAL * 4} seconds'
//           ELSE ss.message_date < $2
//         END
//       END
//     END;
// `;

export const toUsers = `
  SELECT *
  FROM users us
  JOIN members ms ON
    us.user_id = ms.user_id
  JOIN subscriptions ss ON
    ss.member_id = ms.member_id AND
    ss.subject = $2 AND
    ss.sent_date < $3
  JOIN nodes ns ON
    ns.node_id = ms.member_id AND
    ns.net_id = $1;
`;

export const register = `
  UPDATE subscriptions
  SET
    sent_date = now(),
    message_date = $3
  WHERE
    subject = $1 AND
    member_id = $2;
`;
