import { Readable } from 'node:stream';
import { INet, ITableMessages, ITableUsers } from '@shared/types/db';
import { IEventMessage, INewEventsMessage } from '@domain/types';
import { IConnectionService } from '@root/server/types';
import { IServices } from '@root/controller/types';
import { ChatService } from '../chat/chat';
import { IInstantEvent, IMeesageStream } from './notifications.types';

export class NotificationService {
  private connection: IConnectionService;
  private tg: IConnectionService;
  private chat: ChatService;
  private emailInterval: number;
  private messageStream: Readable & AsyncIterable<IMeesageStream>;
  private mailStream: Readable &
    AsyncIterable<{
      user: ITableUsers;
      other?: Record<string, any>;
    }>;
  private tgStream: Readable &
    AsyncIterable<{
      user: ITableUsers;
      message: string;
      other?: Record<string, any>;
    }>;

  constructor(services: IServices) {
    const { chatService } = services;
    this.connection = connectionService;
    this.tg = messengerService;
    this.chat = chatService!;
    this.emailInterval = Number(env.NOTIFICATION_INTERVAL);
    this.messageStream = new Readable({ read: () => true, objectMode: true });
    this.tgStream = new Readable({ read: () => true, objectMode: true });
    this.mailStream = new Readable({ read: () => true, objectMode: true });
    this.sendingToClient();
    this.sendingToEmail();
    this.sendingToTelegram();
  }

  private async sendingToClient() {
    for await (const data of this.messageStream) {
      const { user_id, connectionIds, message } = data;

      const success = await this.connection.sendMessage(message, connectionIds);
      if (success) {
        continue;
      } else {
        logger.warn("CANT'T SEND TO CLIENT", user_id);
      }
    }
  }

  private async sendingToTelegram() {
    for await (const { user, message, other } of this.tgStream) {
      const { user_id, chat_id } = user;

      if (!chat_id || !message) {
        continue;
      }

      try {
        const result = await this.tg!.sendNotification(
          +chat_id!,
          message,
          other,
        );

        other?.onSuccess(result);
      } catch (e) {
        other?.onError(e);
        logger.warn(e);
        logger.warn("CANT'T SEND TO TELEGRAM", user_id);
        this.mailStream.push({ user, other });
      }
    }
  }

  private async sendingToEmail() {
    for await (const { user, other } of this.mailStream) {
      const { user_id, email } = user;

      if (!email) {
        continue;
      }

      if (env.TEST || env.DEV) {
        other?.onSuccess({});
        continue;
      }

      try {
        const result = await mailService.notify(email);
        other?.onSuccess(result);
      } catch (e) {
        other?.onError(e);
        logger.warn(e);
        logger.warn("CAN'T SEND TO EMAIL", user_id);
      }
    }
  }

  sendForUsers(
    users: ITableUsers[],
    message: ITableMessages,
    onMessageSent: (users: ITableUsers, message: ITableMessages) => void,
  ) {
    for (const user of users) {
      this.tgStream.push({
        user,
        message: message.content,
        other: {
          onSuccess: () => onMessageSent(user, message),
        },
      });
    }
  }

  async sendEventOrNotif(user_id: number, message: string, netName = '') {
    const connectionIds = this.chat.getUserConnections(user_id);
    if (connectionIds) {
      const message: INewEventsMessage = {
        type: 'NEW_EVENTS',
      };
      this.messageStream.push({ user_id, connectionIds, message });
    }

    const content = netName ? `<b>${netName}</b>\n${message}` : message;
    this.sendToTgOrEmail(user_id, content).catch(logger.error.bind(logger));
  }

  private async sendToTgOrEmail(user_id: number, message: string) {
    const [user] = await execQuery.user.get([user_id]);

    if (!user) {
      return;
    }

    const onSuccess = () =>
      execQuery.user.events
        .write([user_id, new Date()])
        .catch(logger.error.bind(logger));

    if (user.chat_id) {
      this.sendToTelegram(user, message, { onSuccess });
    } else {
      this.sendToEmail(user, { onSuccess });
    }
  }

  async sendToTelegram(
    user: Pick<ITableUsers, 'user_id' | 'chat_id'>,
    message: string,
    other?: Record<string, any>,
  ) {
    // const [userEvents] = await execQuery.user.events.get([user.user_id]);
    // const prevNotifDateStr = userEvents?.notification_date || 0;
    // const prevNotifDate = new Date(prevNotifDateStr).getTime();
    // const curDate = new Date().getTime();
    // if (prevNotifDate < curDate - this.tgInterval) return;
    this.tgStream.push({ user, message, other });
  }

  private async sendToEmail(user: ITableUsers, other: Record<string, any>) {
    const [userEvents] = await execQuery.user.events.get([user.user_id]);
    const prevNotifDateStr = userEvents?.notification_date || 0;
    const prevNotifDate = new Date(prevNotifDateStr).getTime();
    const curDate = new Date().getTime();
    if (prevNotifDate < curDate - this.emailInterval) return;
    this.mailStream.push({ user, other });
  }

  sendNetEventOrNotif(net: INet, from_node_id: number | null, message: string) {
    this.sendNetEventOrNotifToTg(net, from_node_id, message).catch(
      logger.error.bind(logger),
    );
    this.sendNetEventOrNotifToEmail(net, from_node_id).catch(
      logger.error.bind(logger),
    );
  }

  async sendNetEventOrNotifToTg(
    net: INet,
    from_node_id: number | null,
    message: string,
  ) {
    // const prevNotifDate = new Date().getTime() - this.tgInterval;
    // const prevNotifDateStr = new Date(prevNotifDate).toUTCString();
    const users = await execQuery.net.users.toNotifyOnTg([
      net.net_id,
      from_node_id,
      // prevNotifDateStr,
      new Date().toISOString(),
    ]);

    const newEventsMessage: INewEventsMessage = { type: 'NEW_EVENTS' };
    const messageText = `<b>${net.name}</b>\n${message}`;
    const date = new Date();
    const onSuccess = (user: ITableUsers) =>
      execQuery.user.events
        .write([user.user_id, date])
        .catch(logger.error.bind(logger));

    for (const user of users) {
      const { user_id } = user;
      /* send to client */
      const connectionIds = this.chat.getUserConnections(user_id);
      if (connectionIds) {
        this.messageStream.push({
          user_id,
          connectionIds,
          message: newEventsMessage,
        });
      }

      // todo add web_app button with defined pathname, e.g. origin/net/waiting
      this.tgStream.push({ user, message: messageText, other: { onSuccess } });
    }
  }

  async sendNetEventOrNotifToEmail(net: INet, from_node_id: number | null) {
    const prevNotifDate = new Date().getTime() - this.emailInterval;
    const prevNotifDateStr = new Date(prevNotifDate).toUTCString();
    const users = await execQuery.net.users.toNotifyOnEmail([
      net.net_id,
      from_node_id,
      prevNotifDateStr,
    ]);

    const newEventsMessage: INewEventsMessage = { type: 'NEW_EVENTS' };
    // const messageText = `<b>${net.name}</b>\n${message}`;
    const date = new Date();
    const onSuccess = (user: ITableUsers) =>
      execQuery.user.events
        .write([user.user_id, date])
        .catch(logger.error.bind(logger));

    for (const user of users) {
      const { user_id } = user!;
      const connectionIds = this.chat.getUserConnections(user_id);
      if (connectionIds) {
        this.messageStream.push({
          user_id,
          connectionIds,
          message: newEventsMessage,
        });
      }
      this.mailStream.push({ user, other: { onSuccess } });
    }
  }

  async sendEvent(event: IInstantEvent) {
    const { user_id, net_id } = event;
    let connectionIds: Set<number> | undefined;
    if (user_id) {
      /* for user */
      connectionIds = this.chat.getUserConnections(user_id);
    } else if (net_id) {
      /* for users in net */
      // connectionIds = chatService.getNetConnections(net_id);
    }
    if (!connectionIds) {
      return;
    }

    const message: IEventMessage = {
      type: 'EVENT',
      event_id: 0,
      date: new Date(),
      ...event,
    };
    this.messageStream.push({ user_id, net_id, connectionIds, message });
  }
}

export default (config: unknown, services: IServices) =>
  new NotificationService(services);
