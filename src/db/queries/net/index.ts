import { INet, ITableNets } from '@shared/types/db';
import { TQuery } from '@db/types';
import { IQueriesNetData } from './data';
import { IQueriesNetCircle } from './circle';
import { IQueriesNetTree } from './tree';
import { IQueriesNetBranch } from './branch';
import { IQueriesNetFind } from './find';
import { IQueriesNetUsers } from './users';
import { IQueriesNetStructure } from './structure/get';
import { IQueriesNetWait } from './wait';

export interface IQueriesNet {
  createRoot: TQuery<[], ITableNets>;
  setRootNet: TQuery<[['net_id', number]], ITableNets>;
  createChild: TQuery<[['parent_net_id', number]], ITableNets>;
  updateCountOfNets: TQuery<
    [['net_id', number | null], ['addCount', number]],
    ITableNets
  >;
  remove: TQuery<[['net_id', number]]>;
  get: TQuery<[['net_id', number]], INet>;
  lock: TQuery<[['net_id', number]]>;
  data: IQueriesNetData;
  circle: IQueriesNetCircle;
  tree: IQueriesNetTree;
  branch: IQueriesNetBranch;
  find: IQueriesNetFind;
  users: IQueriesNetUsers;
  structure: { get: IQueriesNetStructure };
  wait: IQueriesNetWait;
}

export const createRoot = `
  INSERT INTO nets
  DEFAULT VALUES
  RETURNING *
`;

export const setRootNet = `
  UPDATE nets
  SET root_net_id = $1
  WHERE net_id = $1
  RETURNING *
`;

export const createChild = `
  INSERT INTO nets (
    parent_net_id, root_net_id, net_level
  )
    SELECT $1, root_net_id, net_level + 1
    FROM nets
    WHERE net_id = $1
  RETURNING *
`;

export const updateCountOfNets = `
  UPDATE nets
  SET count_of_nets = count_of_nets + $2
  WHERE net_id = $1
  RETURNING *
`;

export const remove = `
  DELETE FROM nets
  WHERE net_id = $1
`;

export const get = `
  SELECT *
  FROM nets
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id
  WHERE nets.net_id = $1
`;

export const lock = `
  SELECT * FROM nets
  WHERE net_id = $1
  FOR UPDATE
`;
