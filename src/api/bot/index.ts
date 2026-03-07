import Joi from 'joi';
import { Message } from 'grammy/types';
import { InlineKeyboard } from 'grammy';
import { THandler } from '@root/controller/types';
import { INet } from '@domain/types';

const messagesBuffer = new Map<number, Message>();
const buttonsBuffer = new Map<number, number>();

const clear = (chatId: number) => {
  messagesBuffer.delete(chatId);
  buttonsBuffer.delete(chatId);
};
/*
  - on first request receive message
  - on second request receive netId ofnet to send
*/
const setMessage = async (net: INet, message: Message) => {
  await new domain.events.Events().setMessage(net.net_id, message);
  clear(message.chat.id);
  return { message: `Відправлено в\n<b>${net!.name}</b>` };
};

export const message: THandler<
  {
    chatId: number;
    netId?: number;
    message?: Record<string, string>;
  },
  { message?: string } | boolean
> = async ({ isAdmin }, { chatId, netId, message: msg }) => {
  let message = msg as unknown as Message | undefined;

  if (!isAdmin || (!netId && !message)) {
    clear(chatId);
    throw Error('Uknown error');
  }

  const [user] = await execQuery.user.findByChatId([chatId]);
  if (!user) {
    clear(chatId);
    throw Error('Uknown error');
  }

  const nets = await execQuery.user.nets.getWhereIsAdmin([user!.user_id]);
  if (!nets.length) {
    clear(chatId);
    return false;
  }

  let net: INet | undefined;

  if (netId) {
    net = nets.find((v) => v.net_id === netId);
    if (!net) {
      return { message: 'Невірна спільнота' };
    }
    message = messagesBuffer.get(chatId);
  } else if (nets.length === 1) {
    [net] = nets;
  }

  if (!message) {
    clear(chatId);
    throw Error('Uknown error');
  }

  if (net) {
    message!.text = `<b>${net!.name}</b>\n${message!.text}`;
    return setMessage(net, message);
  } else {
    messagesBuffer.set(chatId, message)!;
  }

  /* send buttons to tg */
  const buttons = nets.map((net) => [
    {
      text: net.name,
      callback_data: `/send_message_to:${net.net_id}`,
    },
  ]);

  await notificationService.sendToTelegram(user!, 'Оберіть спільноту:', {
    reply_markup: new InlineKeyboard(buttons),
    onSuccess: (message: Message.TextMessage) =>
      buttonsBuffer.set(chatId, message.message_id),
  });

  return true;
};
message.paramsSchema = {
  chatId: Joi.number().required(),
  netId: Joi.number(),
  message: Joi.any(),
};
message.responseSchema = [{ message: Joi.string() }, Joi.boolean()];
