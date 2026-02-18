import Joi from 'joi';
import { Message } from 'grammy/types';
import { THandler } from '../../controller/types';
import { InlineKeyboard } from 'grammy';

// const ALLOWED_FOR = ['OWNER', 'ADMIN'];

export const message: THandler<
  { chatId: number; net_id: number; message: Record<string, string> },
  boolean
> = async ({ isAdmin }, { chatId, net_id, message }) => {
  if (!isAdmin) {
    return false;
  }

  const [user] = await execQuery.user.findByChatId([chatId]);

  if (!net_id) {
    const nets = await execQuery.user.nets.getWhereIsAdmin([user!.user_id]);

    console.log(nets);

    if (!nets?.length) {
      return false;
    }

    /* send to tg */
    const buttons = nets.map((net) => [
      {
        text: net.name,
        callback_data: '/callback',
      },
    ]);
    const reply_markup = new InlineKeyboard(buttons);
    await notificationService.sendToTelegram(user!, 'message', {
      reply_markup,
    });

    return true;
  }
  // const [role] = await execQuery.role.getByChatId([chatId]);
  // const allowed = ALLOWED_FOR.includes(role?.name || '');
  const [member] = await execQuery.member.find.getByChatId([chatId]);
  const allowed = member && !member.parent_node_id;

  if (!allowed) {
    return false;
  }

  return new domain.events.Events().setMessage(message as unknown as Message);
};
message.responseSchema = Joi.boolean();
