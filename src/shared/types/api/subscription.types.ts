import { ISubscription } from '../../local/imports';
import { IUserNode } from './member.types';

export type IUpdateSubscription = IUserNode & ISubscription;

export type IGetSubscription = ISubscription[];

export type IRemoveSubscription = IUserNode & Partial<ISubscription>;
