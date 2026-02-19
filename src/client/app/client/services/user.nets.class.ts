import { Store } from '../lib/store/store';
import * as T from '../../types/types';
import { INets, INITIAL_NETS } from '../types';
import { App } from '../app';

interface UserNetsState {
  allNets: T.INetsResponse;
  waitNets: T.IWaitNets;
  nets: INets;
}

export class UserNets extends Store<UserNetsState> {
  constructor(private app: App) {
    super({ allNets: [], waitNets: [], nets: INITIAL_NETS });
  }

  // getUserNets() {
  //   return {
  //     nets: this.nets,
  //     waitNets: this.waitNets,
  //   };
  // }

  // private setAllNets(nets: T.INetsResponse) {
  //   if (this.allNets === nets) return;
  //   this.allNets = nets;
  //   this.app.emit('allnets', nets);
  //   this.getNets();
  // }

  // private setNets(nets: INets) {
  //   if (this.nets === nets) return;
  //   this.nets = nets;
  //   this.app.emit('nets', nets);
  // }

  async getAllNets() {
    const allNets = await this.app.api.user.nets.get.all();
    this.$state.allNets = allNets;
    this.getNets();
  }

  getNets() {
    const { userNet: net } = this.app.getState();
    const { net_id: netId = null, parent_net_id: parentNetId = null } = net || {};
    const nets = { ...INITIAL_NETS };
    nets.siblingNets = this.$state.allNets.filter(
      ({ parent_net_id }) => parent_net_id === parentNetId,
    );
    if (!net) return this.setState({ nets });
    nets.childNets = this.$state.allNets.filter((item) => item.parent_net_id === netId);
    let curParentNetId = parentNetId;
    nets.parentNets = this.$state.allNets
      .reduceRight(
        (acc, item) => {
          if (!curParentNetId) return acc;
          const { net_id: curNetId, parent_net_id: nextParentNetId } = item;
          if (curNetId !== curParentNetId) return acc;
          acc.push(item);
          curParentNetId = nextParentNetId;
          return acc;
        },
        [...nets.parentNets],
      )
      .reverse();
    this.setState({ nets });
  }

  async getWaitNets() {
    const waitNets = await this.app.api.user.nets.get.wait();
    this.setState({ waitNets });
  }

  async waitCreate(args: T.IWaitCreateParams) {
    const result = await this.app.api.net.wait.create(args);
    const { error } = result || {};
    if (!error) await this.getWaitNets();
    return result;
  }

  async waitRemove(args: T.INetEnterParams) {
    await this.app.api.net.wait.remove(args);
    await this.getWaitNets();
  }
}
