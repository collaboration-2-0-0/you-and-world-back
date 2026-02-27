import { Message } from 'grammy/types';
import { SubscriptionSubjectKeys } from '../types';

const SUBJECT_BY_TEG: Record<string, SubscriptionSubjectKeys> = {
  '#news': 'URGENT',
  '#новина': 'URGENT',
  '#report': 'REPORT',
  '#звіт': 'REPORT',
};

export class Events {
  private notifService = notificationService;

  async setMessage(netId: number, message: Message) {
    const { message_id, text, edit_date, date, chat } = message;

    if (!text) {
      throw new Error('Empty message');
    }

    // const [tag] = text!.split(/\s/);
    // const subject = tag && SUBJECT_BY_TEG[tag.toLocaleLowerCase()];
    // text = text.replace(RegExp(`^${tag}\\s`, 'i'), `${tag}\n`);

    const subject = SUBJECT_BY_TEG['#news'] || 'URGENT';

    // if (!subject) {
    //   if (chat.id) {
    //     this.echo(chat.id, text);
    //     return true;
    //   }
    //   throw new Error('No chat id');
    // }

    await execQuery.message.update([
      netId,
      message_id,
      subject,
      text,
      new Date((edit_date || date) * 1000),
    ]);

    await this.sendMessage(netId, subject);

    return true;
  }

  // echo(chatId: number, text: string) {
  //   let content = text.replace(/^#test\s/i, `#test\n`);
  //   content = content.replace(/^#тест\s/i, `#тест\n`);
  //   const user = { chat_id: chatId.toString() } as ITableUsers;
  //   const message = { content } as ITableMessages;
  //   this.notifService.sendForUsers([user], message);
  // }

  async sendMessage(netId: number, subject: SubscriptionSubjectKeys) {
    const messages = await execQuery.message.get([netId, subject]);
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]!;

      const users = await execQuery.subscription.send.toUsers([
        netId,
        subject,
        msg.date,
      ]);

      if (!users.length) {
        await execQuery.message.removeById([msg.message_id]);
      } else if (i === messages.length - 1) {
        this.notifService.sendForUsers(users, msg);
      }
    }
  }
}
