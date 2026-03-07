import Joi from 'joi';
import { IMember } from '@shared/types/db';
import { THandler } from '@root/controller/types';

const disconnectUnactive: THandler<{ monthAgo: number }, boolean> = async (
  { isAdmin },
  { monthAgo },
) => {
  if (!isAdmin) {
    return false;
  }

  const date = new Date();
  const month = date.getMonth();
  date.setMonth(month - monthAgo);

  const { removeMemberFromNet } = domain.net.NetArrange;
  let member: IMember | undefined;

  do {
    [member] = await execQuery.member.find.unactive([date]);
    if (!member) {
      break;
    }
    await removeMemberFromNet('UNACTIVE_DISCONNECT', member);
  } while (true);

  return true;
};
disconnectUnactive.paramsSchema = { monthAgo: Joi.number().required() };
disconnectUnactive.responseSchema = Joi.boolean();

export = disconnectUnactive;
