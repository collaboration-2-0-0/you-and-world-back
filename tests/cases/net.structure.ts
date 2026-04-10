import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const generalCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Get NEt STRUCTURE over WS',
    connection: 'ws',
    caseUnits: [[units.net.get.structure(1), 0]],
  },
];
