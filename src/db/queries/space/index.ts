import { TQuery } from '@db/types';
import { ITableSpaces, ISpace } from '@shared/types/db';
import { IQueriesSpaceTree } from './tree';

export interface IQueriesSpace {
  create: TQuery<
    [
      ['name', string],
      ['description', string | null],
      ['parent_space_id', number | null],
    ],
    ISpace
  >;
  get: TQuery<[['space_id', number]], ISpace>;
  update: TQuery<
    [['space_id', number], ['name', string], ['description', string | null]],
    ITableSpaces
  >;
  remove: TQuery<[['space_id', number]]>;
  tree: IQueriesSpaceTree;
}

export const create = `
  WITH new_space AS (
    INSERT INTO spaces (name, description)
    VALUES ($1, $2)
    RETURNING *
  )
  INSERT INTO spaces_to_spaces (space_id, parent_space_id)
  SELECT space_id, $3 FROM new_space
  RETURNING
    (SELECT s.space_id FROM new_space s WHERE s.space_id = spaces_to_spaces.space_id) AS space_id,
    (SELECT s.name FROM new_space s WHERE s.space_id = spaces_to_spaces.space_id) AS name,
    (SELECT s.description FROM new_space s WHERE s.space_id = spaces_to_spaces.space_id) AS description,
    spaces_to_spaces.space_rel_id,
    spaces_to_spaces.parent_space_id
`;

export const get = `
  SELECT s.*, sts.*
  FROM spaces s
  JOIN spaces_to_spaces sts ON sts.space_id = s.space_id
  WHERE s.space_id = $1
`;

export const update = `
  UPDATE spaces
  SET
    name = $2,
    description = $3
  WHERE space_id = $1
  RETURNING *
`;

export const remove = `
  DELETE FROM spaces
  WHERE space_id = $1
`;
