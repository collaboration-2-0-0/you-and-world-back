/* eslint-disable max-len */

import { NetEventKeys } from '../../client/app/types/types';
import { ITransaction } from '../../db/types/types';
import { INet } from '../types/net.types';
import { IMember } from '../types/member.types';
import { EventMessages } from './event.messages';

export class NetEvent {
  private notifService = notificationService;
  private children: NetEvent[] = [];
  public net: INet | null;
  public event_type: NetEventKeys;
  public member: IMember | null;
  public messages: EventMessages;

  constructor(
    net: INet | null,
    event_type: NetEventKeys,
    member: IMember | null = null,
  ) {
    this.net = net;
    this.event_type = event_type;
    this.member = member;
    this.messages = new EventMessages(this);
  }

  createChild(event_type: NetEventKeys, member: IMember | null = null) {
    const event = new NetEvent(this.net, event_type, member);
    this.children.push(event);
    return event;
  }

  async commit(t?: ITransaction) {
    for (const child of this.children) {
      await child.commit(t);
    }
    // console.log('COMMIT', {
    //   records: this.messages.records,
    //   instant: this.messages.instantRecords,
    // });
    const { messages, event_type } = this;
    for (const record of messages.records) {
      const { user_id, net_id, net_view, from_node_id, message } = record;
      const params = [
        net_id === undefined ? this.net && this.net.net_id : net_id,
        net_view,
        from_node_id,
        event_type,
        message,
      ] as const;
      if (user_id) {
        await (t?.execQuery || execQuery).events.create([user_id, ...params]);
      } else {
        const users = await this.getUsers(from_node_id, t);
        for (const { user_id } of users) {
          await (t?.execQuery || execQuery).events.create([user_id, ...params]);
        }
      }
    }
  }

  private async getUsers(from_node_id: number | null, t?: ITransaction) {
    const { net, event_type } = this;
    if (!net) return []; // throw error
    let users;
    if (event_type === 'WAIT') {
      users = await (t?.execQuery || execQuery).net.users.toSendWaitingEvents([
        net.net_id,
        this.event_type,
      ]);
    } else {
      users = await (t?.execQuery || execQuery).net.users.toSendNewEvents([
        net.net_id,
        from_node_id,
        event_type,
      ]);
    }
    return users;
  }

  send() {
    for (const child of this.children) child.send();
    /* send events */
    for (const record of this.messages.instantRecords) {
      this.notifService.sendEvent({
        net_id: this.net && this.net.net_id,
        event_type: this.event_type,
        ...record,
      });
    }
    /* send events or notifications */
    for (const record of this.messages.records) {
      const { user_id, from_node_id } = record;
      if (user_id) {
        // for user
        this.notifService.sendEventOrNotif(
          user_id,
          record.message,
          record.netName,
        );
      } else if (this.net) {
        // for users in net
        this.notifService.sendNetEventOrNotif(
          this.net,
          from_node_id,
          record.message,
        );
      } else {
        logger.warn('Unknown event record', record);
      }
    }
  }
}
