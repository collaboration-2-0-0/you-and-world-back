export * as events from './events/events';
import * as event from './event/event';
import * as member from './member/member';
import * as utils from './utils/utils';

import * as netBase from './net/net';
import * as netArrange from './net/net.arrange';
export const net = { ...netBase, ...netArrange };

export type IDomain = {
  events: typeof import('./events/events');
  net: typeof net;
  event: typeof event;
  member: typeof member;
  utils: typeof utils;
};
