/* eslint-disable indent */
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';

export const createPathResolve = (basePath: string) => (path: string) =>
  resolve(basePath, path);

/**
 * '/path1/path2/path3/' => ['path1', 'path2', 'path3']
 */
export const pathToArray = (pathname: string) =>
  pathname.split('/').filter(Boolean);

export const runHeavyOperation = (
  operation: (index: number) => void,
  callsCount: number | (() => number),
  counter = 0,
) => {
  const count = typeof callsCount === 'number' ? callsCount : callsCount();
  const sprint = count / 10;
  for (let i = 0; i < sprint && counter < count; counter++, i++)
    operation(counter);
  if (counter >= count) return;
  setTimeout(0).then(() => runHeavyOperation(operation, count, counter));
};
