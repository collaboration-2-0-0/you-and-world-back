import { TQuery } from '@db/types';
import { ISpace } from '@shared/types/db';

export interface IQueriesMemberSpace {
  get: TQuery<[['member_id', number]], ISpace>;
  add: TQuery<[['member_id', number], ['space_rel_id', number]]>;
  remove: TQuery<[['member_id', number], ['space_rel_id', number]]>;
}

export const get = `
  SELECT s.*, sts.*
  FROM members_spaces ms
  JOIN spaces_to_spaces sts ON sts.space_rel_id = ms.space_rel_id
  JOIN spaces s ON s.space_id = sts.space_id
  WHERE ms.member_id = $1
`;

export const add = `
  INSERT INTO members_spaces (member_id, space_rel_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
`;

export const remove = `
  DELETE FROM members_spaces
  WHERE member_id = $1 AND space_rel_id = $2
`;
