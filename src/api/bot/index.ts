import Joi from 'joi';
import { Message } from 'grammy/types';
import { THandler } from '../../controller/types';
import { InlineKeyboard } from 'grammy';

const messagesBuffer = new Map<number, Record<string, string>>();

export const message: THandler<
  { chatId: number; netId?: string; message?: Record<string, string> },
  boolean
> = async ({ isAdmin }, { chatId, netId, message }) => {
  if (!isAdmin) {
    return false;
  }

  if (!netId && !message) {
    return false;
  }

  const [user] = await execQuery.user.findByChatId([chatId]);
  if (!user) {
    return false;
  }

  const nets = await execQuery.user.nets.getWhereIsAdmin([user!.user_id]);
  if (!nets.length) {
    return false;
  }

  if (netId) {
    const message = messagesBuffer.get(chatId);
    const net = nets.find((v) => v.net_id === +netId);
    if (!message || !net) {
      return false;
    }

    return new domain.events.Events().setMessage(message as unknown as Message);
  }

  if (nets.length === 1) {
    return new domain.events.Events().setMessage(message as unknown as Message);
  }

  messagesBuffer.set(chatId, message!);
  /* send buttons to tg */
  const buttons = nets.map((net) => [
    {
      text: net.name,
      callback_data: `/send_message_to:${net.net_id}`,
    },
  ]);
  const reply_markup = new InlineKeyboard(buttons);
  await notificationService.sendToTelegram(user!, 'message', {
    reply_markup,
  });

  return true;
};
message.responseSchema = Joi.boolean();
