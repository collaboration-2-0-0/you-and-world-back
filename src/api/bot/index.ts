import Joi from 'joi';
import { Message } from 'grammy/types';
import { THandler } from '../../controller/types';
import { InlineKeyboard } from 'grammy';

const messagesBuffer = new Map<number, Message>();

export const message: THandler<
  { chatId: number; netId?: string; message?: Record<string, string> },
  boolean
> = async ({ isAdmin }, { chatId, netId, message: msg }) => {
  const message = msg as unknown as Message;
  if (!isAdmin || (!netId && !message)) {
    messagesBuffer.delete(chatId);
    return false;
  }

  const [user] = await execQuery.user.findByChatId([chatId]);
  if (!user) {
    messagesBuffer.delete(chatId);
    return false;
  }

  const nets = await execQuery.user.nets.getWhereIsAdmin([user!.user_id]);
  if (!nets.length) {
    messagesBuffer.delete(chatId);
    return false;
  }

  if (netId) {
    const message = messagesBuffer.get(chatId);
    const net = nets.find((v) => v.net_id === +netId);
    if (!message || !net) {
      messagesBuffer.delete(chatId);
      return false;
    }

    return new domain.events.Events().setMessage(net.net_id, message);
  }

  if (nets.length === 1) {
    const [net] = nets;
    return new domain.events.Events().setMessage(net!.net_id, message);
  }

  messagesBuffer.set(chatId, message);
  /* send buttons to tg */
  const buttons = nets.map((net) => [
    {
      text: net.name,
      callback_data: `/send_message_to:${net.net_id}`,
    },
  ]);
  const reply_markup = new InlineKeyboard(buttons);
  await notificationService.sendToTelegram(user!, 'Надіслати в спільноту:', {
    reply_markup,
  });

  return true;
};
message.responseSchema = Joi.boolean();
