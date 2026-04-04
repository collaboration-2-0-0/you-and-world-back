import { ITableNodes } from '@shared/types/db';
import { TQuery } from '@db/types';

export interface IQueriesNodeTree {
  create: TQuery<
    [
      ['node_level', number],
      ['parent_node_id', number],
      ['net_id', number],
      ['node_position', number],
      ['node_address', string],
    ]
  >;
  remove: TQuery<[['parent_node_id', number]], Pick<ITableNodes, 'node_id'>>;
}

export const create = `
  INSERT INTO nodes (
    node_level, parent_node_id, net_id, node_position, node_address
  )
  VALUES ($1, $2, $3, $4, $5)
`;

export const remove = `
  DELETE FROM nodes
  WHERE parent_node_id = $1
  RETURNING node_id::int
`;
