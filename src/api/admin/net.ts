import { THandler } from '@root/controller/types';
import { INetEnterParams } from '@shared/types/api';
import { NetEnterParamsSchema } from '../schema';

export const get: THandler<INetEnterParams, any> = async (_, { net_id }) => {
  const [rootMember] = await execQuery.net.structure.get.root([net_id]);

  if (!rootMember) return { net: 'null' };

  const net = await domain.net.getNetNode(rootMember);
  domain.net.showNet(net);

  return { net };
};
get.paramsSchema = NetEnterParamsSchema;
get.responseSchema = {};
get.allowedForUser = 'NOT_LOGGED_IN';
