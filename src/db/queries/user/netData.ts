import { TQuery } from '../../types/types';
import { IUserNetDataResponse } from '../../../shared/server/types';
import { IMember } from '@domain/types';

export interface IQueriesUserNetData {
  findByNode: TQuery<[['user_id', number], ['node_id', number]], IMember>;
  get: TQuery<[['user_id', number], ['net_id', number]], IUserNetDataResponse>;
}

export const findByNode = `
  SELECT
    nodes.*,
    members.*,
    users.*
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  INNER JOIN users ON
    users.user_id = members.user_id
  WHERE
    members.user_id = $1 AND
    members.member_id = $2
`;

export const get = `
  SELECT
    nodes.node_id,
    nodes.parent_node_id,
    nodes.count_of_members,
    members.confirmed,
    members_to_members.vote,
    SUM (
      CASE
        WHEN mtm.vote = true THEN 1
        ELSE 0
      END
    ) AS vote_count
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  LEFT JOIN members_to_members ON
    members_to_members.from_member_id = members.member_id AND
    members_to_members.to_member_id = members.member_id
  LEFT JOIN members_to_members as mtm ON
    mtm.to_member_id = members.member_id AND
    mtm.branch_id = nodes.parent_node_id
  WHERE
    members.user_id = $1 AND
    nodes.net_id = $2
  GROUP BY
    nodes.node_id,
    nodes.parent_node_id,
    members.confirmed,
    members_to_members.vote
`;
