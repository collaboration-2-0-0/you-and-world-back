import { THandler } from '@root/controller/types';
import { INetUpdateParams, INetResponse } from '@shared/types/api';
import { NetResponseSchema, NetUpdateParamsSchema } from '../schema';

const update: THandler<INetUpdateParams, INetResponse> = async (
  { member },
  { name, goal, rules },
) => {
  const { net_id, node_id, parent_node_id } = member!.get();
  if (parent_node_id !== null) return null; // bad request
  // if (count_of_members > 1) return null; // bad request

  const [net] = await execQuery.net.find.byNode([node_id]);

  await execQuery.net.data.update([
    net_id,
    name !== undefined ? name : net!.name,
    goal !== undefined ? goal || null : net!.goal,
    rules !== undefined ? rules || null : net!.rules,
  ]);

  const [netUpdated] = await execQuery.net.find.byNode([node_id]);

  return netUpdated!;
};
update.paramsSchema = NetUpdateParamsSchema;
update.responseSchema = NetResponseSchema;
update.checkNet = true;

export = update;
