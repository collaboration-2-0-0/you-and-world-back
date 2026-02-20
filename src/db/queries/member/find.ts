import { IMember, IMemberWithInvites } from '@domain/types';
import { TQuery } from '../../types/types';

export interface IQueriesMemberFind {
  unactive: TQuery<[['date', string]], IMember>;
  inTree: TQuery<
    [['user_node_id', number], ['member_node_id', number]],
    IMemberWithInvites
  >;
  inCircle: TQuery<
    [['parent_node_id', number], ['member_node_id', number]],
    IMemberWithInvites
  >;
  getByChatId: TQuery<[['chat_id', number]], IMember>;
}

export const unactive = `
  SELECT
    nodes.*,
    members.*
-- users.*
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  WHERE
    members.active_date < $1 AND
    members.confirmed = true
  LIMIT 1
`;

export const inTree = `
  SELECT
    nodes.*,

    members.*,
    members_invites.member_name,
    members_invites.token
-- users.*
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_invites ON
    members_invites.node_id = nodes.node_id
  WHERE
    nodes.parent_node_id = $1 AND
    nodes.node_id = $2
`;

export const inCircle = `
  SELECT
    nodes.*,
    members.*,
    members_invites.member_name,
    members_invites.token
-- users.*
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  LEFT JOIN members_invites ON
    members_invites.node_id = nodes.node_id
  WHERE
    nodes.node_id = $2 AND (
      nodes.parent_node_id = $1 OR
      nodes.node_id = $1
    )
`;

export const getByChatId = `SELECT
    nodes.*,
    members.*
-- users.*
  FROM nodes
  JOIN members ON
    members.member_id = nodes.node_id
  JOIN users ON
    members.user_id = users.user_id
  WHERE
    users.chat_id = $1
`;
