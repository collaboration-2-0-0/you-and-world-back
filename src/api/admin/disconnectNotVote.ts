import Joi from 'joi';
import { THandler } from '@root/controller/types';

const disconnectNotVote: THandler<{ monthAgo: number }, boolean> = async (
  { isAdmin },
  { monthAgo },
) => {
  if (!isAdmin) {
    return false;
  }

  const date = new Date();
  const month = date.getMonth();
  date.setMonth(month - monthAgo);

  do {
    const [parentNode] = await execQuery.node.findFreeByDate([date]);

    if (!parentNode) {
      return true;
    }

    const { node_id, net_id } = parentNode;
    const [net] = await execQuery.net.get([net_id]);
    const event = new domain.event.NetEvent(net!, 'NOT_VOTE');

    // eslint-disable-next-line no-loop-func
    await domain.utils.exeWithNetLock(net_id, async (t) => {
      const [exists] = await execQuery.node.getIfEmpty([node_id]);

      if (!exists) {
        return;
      }

      const netArrange = new domain.net.NetArrange(t);
      const members = await t.execQuery.net.tree.getMembers([node_id]);
      const nodesToArrange = [node_id];
      let netRemovedAll = 0;
      for (const member of members) {
        const { node_id } = member;
        const childEvent = event.createChild('NOT_VOTE_DISCONNECT', member);
        const { netRemoved } =
          await netArrange.removeMemberFromNetAndSubnets(childEvent);
        nodesToArrange.push(node_id);
        if (netRemoved) {
          await t.execQuery.net.updateCountOfNets([net_id, -netRemoved]);
        }
        netRemovedAll += netRemoved;
      }
      await netArrange.arrangeNodes(event, nodesToArrange);

      const [netExist] = await t.execQuery.net.get([net_id]);
      netRemovedAll += netExist ? 0 : 1;
      const { parent_net_id } = net!;
      if (parent_net_id && netRemovedAll) {
        await domain.net.updateCountOfNets(parent_net_id, -netRemovedAll);
      }

      await event.commit(t);
    });

    event.send();
  } while (true);
};
disconnectNotVote.paramsSchema = { monthAgo: Joi.number().required() };
disconnectNotVote.responseSchema = Joi.boolean();

export = disconnectNotVote;
