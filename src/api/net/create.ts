import { THandler } from '../../controller/types';
import { INetCreateParams, INetResponse } from '@root/shared/types/api';
import { MAX_NET_LEVEL } from '@shared/server/constants';
import { NetResponseSchema, NetCreateParamsSchema } from '../schema/schema';

const create: THandler<INetCreateParams, INetResponse> = async (
  { session, member },
  { name },
) => {
  const user_id = session.read('user_id')!;
  const parentNetId = member?.get().net_id ?? null;

  return domain.utils.exeWithNetLock(parentNetId, async (t) => {
    if (member) {
      await member.reinit();
      const { net_level } = member.getNet();
      if (net_level >= MAX_NET_LEVEL) return null;
    }

    return domain.net.createNet(user_id, parentNetId, name, t);
  });
};
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetResponseSchema;
create.checkNet = false;

export = create;
