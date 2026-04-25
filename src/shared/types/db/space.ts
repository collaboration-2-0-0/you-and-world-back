import { ITableSpaces, ITableSpacesToSpaces } from './tables';

export type ISpace = ITableSpaces & ITableSpacesToSpaces;
export type ISpaceDepth = { depth: number | null };
export type ISpaceWithDepth = ISpace & ISpaceDepth;
