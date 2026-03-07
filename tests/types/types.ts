import { mock } from 'node:test';
import { TRpc } from '@shared/client/connection/types';
import { IConfig } from '@root/config/types';
import { TTransport } from '@root/server/types';
import { IParams, TOperationResponse } from '@root/controller/operation.types';

export interface ITestCase {
  title: string;
  dbDataFile?: string;
  connection: TTransport;
  config?: Partial<IConfig>;
  caseUnits: ([TTestUnit, number] | TTestUnit)[];
}

export type TTestUnit = (state: Record<string, any>) => ITestUnit;

export interface ITestUnit {
  title: string;
  operations: IOperationData[];
}

export interface ITestUnits {
  [key: string]: ((...args: any[]) => TTestUnit) | TTestUnit | ITestUnits;
}

export interface IOperationData {
  name: string;
  params?: IParams | (() => IParams);
  expected?: TOperationResponse | ((actual: any) => void);
  setToState?: (actual: any) => void;
  query?: () => Promise<Record<string, any>[]>;
  expectedQueryResult?: TOperationResponse | ((actual: any) => void);
}

export interface ITestRunnerData {
  title: string;
  connections: TRpc[];
  onMessage: TMockFunction[];
  testUnits: [TTestUnit, number][];
}

export type TMockFunction = ReturnType<typeof mock.fn<(data: any) => void>>;
