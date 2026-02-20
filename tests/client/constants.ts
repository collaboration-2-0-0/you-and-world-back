import { MEMBER_STATUS } from '../../src/shared/server/types/types';
import { createEnumFromArray } from '../../src/shared/server/transform.utils';

export enum AppStatus {
  INITING = 'initing',
  INITED = 'inited',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export const MEMBER_STATUS_ENUM = createEnumFromArray(MEMBER_STATUS);

export const CONNECTION_ATTEMPT_COUNT = 3;
export const CONNECTION_ATTEMPT_DELAY = 3000;
export const CONNECTION_TIMEOUT = 20000;
