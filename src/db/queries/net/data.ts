import { ITableNetsData } from '@shared/types/db';
import { TQuery } from '@db/types';

export interface IQueriesNetData {
  get: TQuery<[['net_id', number]], ITableNetsData>;
  create: TQuery<
    [
      ['net_id', number],
      ['name', string],
      ['rules', string | null],
      ['token', string],
    ],
    ITableNetsData
  >;
  update: TQuery<
    [
      ['net_id', number],
      ['name', string | null],
      ['goal', string | null],
      ['rules', string | null],
    ]
  >;
}

export const get = `
  SELECT nets_data.*
  FROM nets_data
  WHERE net_id = $1
`;

export const create = `
  INSERT INTO nets_data (
    net_id, name, rules, net_link
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;

export const update = `
  UPDATE nets_data
  SET name = $2, goal = $3, rules = $4
  WHERE net_id = $1
`;
