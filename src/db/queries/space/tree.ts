import { ISpace, ISpaceWithDepth } from '@shared/types/db';
import { TQuery } from '@db/types';

export interface IQueriesSpaceTree {
  updateParent: TQuery<
    [['space_rel_id', number], ['parent_space_id', number | null]]
  >;
  getByParent: TQuery<[['parent_space_id', number]], ISpace>;
  getRoots: TQuery<[], ISpace>;
  getWithParents: TQuery<[['space_id', number]], ISpaceWithDepth>;
  getTree: TQuery<
    [['parent_space_id', number | null], ['depth', number | null]],
    ISpaceWithDepth
  >;
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

export const getTree = `
  WITH RECURSIVE tree AS (
    SELECT sts.space_rel_id, sts.space_id, sts.parent_space_id,
           s.name, s.description, 0 AS depth,
           ARRAY[sts.space_id] AS path
    FROM spaces_to_spaces sts
    JOIN spaces s ON s.space_id = sts.space_id
    WHERE sts.parent_space_id IS NOT DISTINCT FROM $1::int
    UNION ALL
    SELECT sts.space_rel_id, sts.space_id, sts.parent_space_id,
           s.name, s.description, t.depth + 1,
           t.path || sts.space_id
    FROM spaces_to_spaces sts
    JOIN spaces s ON s.space_id = sts.space_id
    JOIN tree t ON sts.parent_space_id = t.space_id
    WHERE ($2::int IS NULL OR t.depth < $2)
  )
  SELECT space_rel_id, space_id, parent_space_id, name, description, depth
  FROM tree
  ORDER BY path
`;
