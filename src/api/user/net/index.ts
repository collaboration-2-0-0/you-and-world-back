import { THandler } from '@root/controller/types';
import { HandlerError } from '@root/controller/errors';
import { INetEnterParams, IUserNetDataResponse } from '@shared/types/api';
import { NetEnterParamsSchema, UserNetDataResponseSchema } from '../../schema';

export const getData: THandler<INetEnterParams, IUserNetDataResponse> = async (
  { session },
  { net_id },
) => {
  const user_id = session.read('user_id')!;
  const [userNetData] = await execQuery.user.netData.get([user_id, net_id]);
  if (!userNetData) throw new HandlerError('NOT_FOUND');
  return userNetData!;
};
getData.paramsSchema = NetEnterParamsSchema;
getData.responseSchema = UserNetDataResponseSchema;
