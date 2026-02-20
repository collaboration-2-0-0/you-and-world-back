import Joi from 'joi';
import { InlineKeyboard } from 'grammy';
import { THandler } from '../../controller/types';
import { INetInviteParams } from '../../shared/server/types/types';
import { exeWithNetLock } from '../../domain/utils/utils';
import { JOI_NULL } from '../schema/schema';

const create: THandler<INetInviteParams, string | null> = async (
  { origin, member: m },
  { node_id, user_id },
) => {
  const { net_id, confirmed, username } = m!.get();

  const result = exeWithNetLock(net_id, async () => {
    await m!.reinit();

    const { goal } = m!.getNet();
    if (!goal) return null; // bad request
    if (!confirmed) return null; // bad request

    const [waiting] = await execQuery.net.wait.getByUser([net_id, user_id]);
    if (!waiting?.chat_id) return null; // bad request

    await m!.reinit();

    const [emptyNode] = await execQuery.net.tree.getEmptyNodes([node_id]);
    if (!emptyNode) return null; // bad request

    const { node_id: member_id, node_position: member_position } = emptyNode;
    const member_name = `Учасник ${member_position + 1}`;
    const token = cryptoService.createUnicCode(15);

    await execQuery.member.invite.create([
      node_id,
      member_id,
      member_name,
      token,
    ]);

    /* send to tg */
    const message = `@${username} запросив вас до спільноти \n<b>${m!.getNet().name}</b>`;
    const url = `${origin}/net/invite/${token}`;
    const reply_markup = new InlineKeyboard().webApp('ПРИЄДНАТИСЬ', url);
    await notificationService.sendToTelegram(waiting, message, {
      reply_markup,
    });

    return token;
  });

  return result;
};
create.paramsSchema = {
  node_id: Joi.number().required(),
  user_id: Joi.number().required(),
};
create.responseSchema = [Joi.string(), JOI_NULL];
create.checkNet = true;

export = create;
