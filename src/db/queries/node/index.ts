import { ITableNodes } from '@shared/types/db';
import { TQuery } from '@db/types';
import { IQueriesNodeTree } from './tree';

export interface IQueriesNode {
  create: TQuery<[['net_id', number]], ITableNodes>;
  remove: TQuery<[['node_id', number]]>;
  updateCountOfMembers: TQuery<
    [['node_id', number], ['addCount', number]],
    ITableNodes
  >;
  getIfEmpty: TQuery<[['node_id', number]], ITableNodes>;
  getChild: TQuery<
    [['parent_node_id', number], ['node_position', number]],
    ITableNodes
  >;
  move: TQuery<
    [
      ['node_id', number],
      ['new_parent_node_id', number | null],
      ['new_node_level', number],
      ['new_node_position', number],
      ['new_node_address', string],
    ]
  >;
  updateDescendants: TQuery<[['parent_node_id', number]]>;
  findFreeByDate: TQuery<[['strDate', Date]], ITableNodes>;
  tree: IQueriesNodeTree;
}

export const create = `
  INSERT INTO nodes (
    net_id, count_of_members, node_address
  )
  VALUES ($1, 1, '0')
  RETURNING *
`;

export const remove = `
  DELETE FROM nodes
  WHERE node_id = $1
`;

export const updateCountOfMembers = `
  UPDATE nodes
  SET
    count_of_members = count_of_members + $2,
    updated = now()
  WHERE node_id = $1
  RETURNING *
`;

export const getIfEmpty = `
  SELECT *
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    members.member_id ISNULL AND
    nodes.node_id = $1
`;

export const getChild = `
  SELECT nodes.*
  FROM nodes
  WHERE
    parent_node_id = $1 AND
    node_position = $2
`;

/* UPDATE SET FROM WHERE */
export const move = `
  UPDATE nodes
  SET
    parent_node_id = $2,
    node_level = $3,
    node_position = $4,
    node_address = $5
  WHERE node_id = $1
`;

export const updateDescendants = `
WITH RECURSIVE tree AS (
    SELECT n.node_id, (p.node_level + 1) as node_level,
      CASE
        WHEN p.node_address = '0' THEN (n.node_position + 1)::text
        ELSE p.node_address || '.' || (n.node_position + 1)::text
      END AS new_address
    FROM nodes n
    JOIN nodes p ON p.node_id = n.parent_node_id
    WHERE n.parent_node_id = $1
    UNION ALL
    SELECT n.node_id, (tree.node_level + 1) as node_level,
      tree.new_address || '.' || (n.node_position + 1)::text
    FROM nodes n
    JOIN tree ON n.parent_node_id = tree.node_id
  )
  UPDATE nodes SET node_address = tree.new_address, node_level = tree.node_level
  FROM tree WHERE nodes.node_id = tree.node_id
`;

export const findFreeByDate = `
  SELECT *
  FROM nodes
  LEFT JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    members.member_id ISNULL AND
    nodes.count_of_members > 0 AND
    nodes.updated < $1
`;
