import { ITableNodes } from '@shared/types/db';

export type IBranchDislikes = Pick<ITableNodes, 'node_id'> & {
  dislike_count: number;
};

export type IBranchVotes = Pick<ITableNodes, 'node_id'> & {
  vote_count: number;
};
