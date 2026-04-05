import { ITableSpaces, ITableSpacesToSpaces } from '@shared/types/db';
import { TQuery } from '@db/types';

export type ISpaceWithHierarchy = ITableSpaces & ITableSpacesToSpaces;

export interface IQueriesSpaceTree {
  updateParent: TQuery<
    [['space_rel_id', number], ['parent_space_id', number | null]]
  >;
  getByParent: TQuery<[['parent_space_id', number]], ISpaceWithHierarchy>;
  getRoots: TQuery<[], ISpaceWithHierarchy>;
  getWithParents: TQuery<[['space_id', number]], ISpaceWithHierarchy & { depth: number }>;
}

export const updateParent = `
  UPDATE spaces_to_spaces
  SET parent_space_id = $2
  WHERE space_rel_id = $1
`;

export const getByParent = `
  SELECT s.*, sts.*
  FROM spaces_to_spaces sts
  JOIN spaces s ON s.space_id = sts.space_id
  WHERE sts.parent_space_id = $1
`;

export const getRoots = `
  SELECT s.*, sts.*
  FROM spaces_to_spaces sts
  JOIN spaces s ON s.space_id = sts.space_id
  WHERE sts.parent_space_id IS NULL
`;

export const getWithParents = `
  WITH RECURSIVE ancestors AS (
    SELECT sts.space_rel_id, sts.space_id, sts.parent_space_id,
           s.name, s.description, 0 AS depth
    FROM spaces_to_spaces sts
    JOIN spaces s ON s.space_id = sts.space_id
    WHERE sts.space_id = $1
    UNION ALL
    SELECT sts.space_rel_id, sts.space_id, sts.parent_space_id,
           s.name, s.description, a.depth + 1
    FROM spaces_to_spaces sts
    JOIN spaces s ON s.space_id = sts.space_id
    JOIN ancestors a ON sts.space_id = a.parent_space_id
  )
  SELECT * FROM ancestors ORDER BY depth
`;
