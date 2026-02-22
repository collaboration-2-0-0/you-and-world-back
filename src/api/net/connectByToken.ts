import { THandler } from '../../controller/types';
import { INetConnectByToken, IToken } from '@root/shared/types/api';
import type { IMember } from '@domain/types';
import { NetEvent } from '@domain/event/event';
import { TokenSchema, NetConnectByTokenSchema } from '../schema/schema';

const connectByToken: THandler<IToken, INetConnectByToken> = async (
  { session },
  { token },
) => {
  const user_id = session.read('user_id')!;
  const [node] = await execQuery.net.find.byToken([token]);
  if (!node) return null;
  let event!: NetEvent;
  const result = (await domain.utils.exeWithNetLock(node.net_id, async (t) => {
    const [node] = await execQuery.net.find.byToken([token]);
    if (!node) return null;
    const { parent_net_id, net_id, parent_node_id, node_id } = node;
    const [user_exists] = await execQuery.net.find.byUser([net_id, user_id]);
    if (user_exists) return { net_id, error: 'already connected' };

    if (parent_net_id) {
      const [parentNet] = await execQuery.net.find.byUser([
        parent_net_id,
        user_id,
      ]);
      if (!parentNet) return { net_id, error: 'not parent net member' };
    }

    /* remove token */
    await t.execQuery.member.invite.remove([node_id]);
    /* remove wait */
    await t.execQuery.net.wait.remove([net_id, user_id]);

    /* create new member */
    const confirmed = !env.INVITE_CONFIRM;
    await t.execQuery.member.connect([node_id, user_id, confirmed]);
    if (confirmed) {
      const net = new domain.net.NetArrange(t);
      await net.updateCountOfMembers(node_id);
      await domain.net.createTree(t, node);
    }

    /* create messages */
    const newMember = {
      parent_node_id,
      node_id,
      confirmed,
    } as IMember;
    const eventType = confirmed ? 'CONNECT_AND_CONFIRM' : 'CONNECT';
    event = new domain.event.NetEvent(node, eventType, newMember);
    await event.messages.create(t);
    await event.commit(t);

    return { net_id };
  })) as INetConnectByToken;
  event?.send();
  return result;
};
connectByToken.paramsSchema = TokenSchema;
connectByToken.responseSchema = NetConnectByTokenSchema;
connectByToken.checkNet = false;

export = connectByToken;
