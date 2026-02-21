/* eslint-disable import/no-cycle */
import { IEvent } from '../../local/imports';
import { MessageTypeKeys } from './messages.types';

export type IEventMessage = {
  type: Extract<MessageTypeKeys, 'EVENT'>;
} & IEvent;

export interface INewEventsMessage {
  type: Extract<MessageTypeKeys, 'NEW_EVENTS'>;
}
