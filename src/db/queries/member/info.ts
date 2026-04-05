import { ITableMembersInfo } from '@shared/types/db';
import { TQuery } from '@db/types';

export interface IQueriesMemberInfo {
  create: TQuery<
    [
      ['member_id', number],
      ['member_desire', string | null],
      ['member_goal', string | null],
      ['member_activity', string | null],
      ['member_role', string | null],
    ],
    ITableMembersInfo
  >;
  get: TQuery<[['member_id', number]], ITableMembersInfo>;
  update: TQuery<
    [
      ['member_id', number],
      ['member_desire', string | null],
      ['member_goal', string | null],
      ['member_activity', string | null],
      ['member_role', string | null],
    ],
    ITableMembersInfo
  >;
}

export const create = `
  INSERT INTO members_info (
    member_id, member_desire, member_goal, member_activity, member_role
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
`;

export const get = `
  SELECT *
  FROM members_info
  WHERE member_id = $1
`;

export const update = `
  UPDATE members_info
  SET
    member_desire = $2,
    member_goal = $3,
    member_activity = $4,
    member_role = $5
  WHERE member_id = $1
  RETURNING *
`;
