import assert from 'node:assert';
import { delay } from '@shared/server/utils';
import { TRpc } from '@shared/client/connection/types';
import { IOperationData, TMockFunction } from '../types/types';

export const assertDb = async (operation: IOperationData) => {
  const { query, expectedQueryResult: expected } = operation;
  const actual = await query!();
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};

export const assertMessage = async (
  operation: IOperationData,
  onMessage: TMockFunction,
  callId: number,
) => {
  await delay(75);
  const call = onMessage!.mock.calls[callId];
  const actual = call?.arguments[0];
  const { expected } = operation;
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};

export const assertResponse = async (
  operation: IOperationData,
  connection: TRpc,
) => {
  const { name, params, setToState, expected } = operation;
  const data = typeof params === 'function' ? params() : params;
  const actual = await connection(name, data);
  setToState?.(actual);
  if (expected === undefined) return;
  if (typeof expected === 'function') expected(actual);
  // else assert.deepEqual(actual, expected);
  else assert.partialDeepStrictEqual(actual, expected);
};
