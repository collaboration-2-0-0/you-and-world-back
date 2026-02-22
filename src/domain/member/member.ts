import { IMember, INet } from '../types';
import { DomainError } from '../errors';

export class Member {
  private user_id: number;
  private node_id: number;
  private member: IMember | null = null;
  private net: INet | null = null;

  constructor(user_id: number, node_id: number) {
    this.user_id = user_id;
    this.node_id = node_id;
  }

  async init() {
    const [member] = await execQuery.user.netData.findByNode([
      this.user_id,
      this.node_id,
    ]);
    if (!member) throw new DomainError('NOT_FOUND');
    this.member = member;
    return this;
  }

  async reinit() {
    await this.init();
    await this.setNet();
  }

  get() {
    return this.member!;
  }

  getNet() {
    return this.net!;
  }

  status() {
    const { confirmed } = this.get();
    return confirmed ? 'INSIDE_NET' : 'INVITING';
  }

  private async setNet() {
    const { net_id } = this.get();
    const [net] = await execQuery.net.getData([net_id]);
    this.net = net!;
  }
}
