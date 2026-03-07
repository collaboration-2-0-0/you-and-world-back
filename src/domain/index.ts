export * as events from './events/events';
export * as event from './event/event';
export * as member from './member/member';
export * as utils from './utils/utils';

import * as netBase from './net/net';
import * as netArrange from './net/net.arrange';
export const net = { ...netBase, ...netArrange };

export type IDomain = {
  events: typeof import('./events/events');
  net: typeof net;
  event: typeof import('./event/event');
  member: typeof import('./member/member');
  utils: typeof import('./utils/utils');
};
