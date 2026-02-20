import { format } from 'node:util';
import { IEventRecord } from '../../shared/server/types';
import { ITransaction } from '../../db/types/types';
import { INetEventTo, IMember } from '@domain/types';
import {
  INSTANT_EVENTS,
  NET_MESSAGES_MAP,
  SET_NET_ID_FOR,
} from '../../constants/constants';
import { NetEvent } from './event';

export class EventMessages {
  private event: NetEvent;
  private member: IMember | null;
  private eventToMessages: INetEventTo;
  public readonly records: IEventRecord[] = [];
  public readonly instantRecords: IEventRecord[] = [];

  constructor(event: NetEvent) {
    const { member, event_type } = event;
    this.event = event;
    this.member = member;
    this.eventToMessages = NET_MESSAGES_MAP[event_type];
  }

  async create(t?: ITransaction) {
    if (this.member) {
      await this.createInCircle(t);
      await this.createInTree(t);
      await this.createMessageToMember();
    }
    this.createInNet();
  }

  removeFromNodes(nodeIds: number[]) {
    let i = -1;
    for (const { from_node_id } of [...this.records]) {
      i++;
      if (!from_node_id) continue;
      if (!nodeIds.includes(from_node_id)) continue;
      this.records.splice(i--, 1);
    }
  }

  async createInCircle(t?: ITransaction) {
    const { node_id, parent_node_id } = this.member!;
    if (!parent_node_id) return;
    const toFacilitator = this.eventToMessages.FACILITATOR;
    const toCircleMember = this.eventToMessages.CIRCLE;
    if (!toFacilitator && !toCircleMember) return;
    const members = await (t?.execQuery || execQuery).net.circle.getMembers([
      node_id,
      parent_node_id,
    ]);
    for (const member of members) {
      const { node_id: member_node_id, confirmed: member_confirmed } = member;
      if (member_node_id === parent_node_id)
        this.createMessageToFacilitator(member);
      else if (!member_confirmed) continue;
      else this.cretaeMessagesToCircleMember(member);
    }
  }

  createMessageToFacilitator(member: IMember) {
    const message = this.eventToMessages.FACILITATOR;
    if (message === undefined) return;
    const { user_id } = member;
    const { node_id: from_node_id } = this.member!;
    const record: IEventRecord = {
      user_id,
      net_view: 'tree',
      from_node_id,
      message,
      netName: this.event.net?.name,
    };
    const { event_type } = this.event;
    if (INSTANT_EVENTS.includes(event_type)) this.instantRecords.push(record);
    else this.records.push(record);
  }

  cretaeMessagesToCircleMember(member: IMember) {
    const message = this.eventToMessages.CIRCLE;
    if (message === undefined) return;
    const { user_id } = member;
    const { node_id: from_node_id } = this.member!;
    const record: IEventRecord = {
      user_id,
      net_view: 'circle',
      from_node_id,
      message,
      netName: this.event.net?.name,
    };
    const { event_type } = this.event;
    if (INSTANT_EVENTS.includes(event_type)) this.instantRecords.push(record);
    else this.records.push(record);
  }

  async createInTree(t?: ITransaction) {
    const message = this.eventToMessages.TREE;
    if (message === undefined) return;
    const { node_id: from_node_id } = this.member!;
    const members = await (t?.execQuery || execQuery).net.tree.getMembers([
      from_node_id,
    ]);
    for (const { user_id } of members) {
      this.records.push({
        user_id,
        net_view: 'circle',
        from_node_id,
        message,
        netName: this.event.net?.name,
      });
    }
  }

  async createMessageToMember() {
    const { event_type, net } = this.event;
    let message = this.eventToMessages.MEMBER;
    if (message === undefined) return;
    const { user_id } = this.member!;
    const isNet = SET_NET_ID_FOR.includes(event_type);
    if (!isNet) {
      const { name } = net!;
      message = format(message, name);
    }
    this.records.push({
      user_id,
      net_id: isNet ? undefined : null,
      net_view: isNet ? 'net' : null,
      from_node_id: null,
      message,
      netName: net?.name,
    });
  }

  createInNet() {
    const message = this.eventToMessages.NET;
    if (message === undefined) return;
    const { event_type, member } = this.event;
    const record: IEventRecord = {
      user_id: 0,
      net_view: 'net',
      from_node_id: member && member.node_id,
      message,
      netName: this.event.net?.name,
    };
    if (INSTANT_EVENTS.includes(event_type)) {
      this.instantRecords.push(record);
    } else {
      this.records.push(record);
    }
  }

  async createToConnected(user_id: number) {
    const { net } = this.event;
    const message = format(this.eventToMessages.CONNECTED, net?.name);
    this.records.push({
      user_id,
      net_id: null,
      net_view: null,
      from_node_id: null,
      message,
      netName: net?.name,
    });
  }
}
