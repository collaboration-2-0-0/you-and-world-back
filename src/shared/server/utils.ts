import { IMemberResponse, MemberStatusKeys } from './types';

export const getMemberStatus = (
  member: Pick<IMemberResponse, 'count_of_members' | 'confirmed' | 'token'>,
): MemberStatusKeys => {
  const { count_of_members, confirmed, token } = member;
  if (confirmed === true) return 'ACTIVE';
  if (confirmed === false) return 'CONNECTED';
  if (count_of_members) return 'FREE';
  if (token) return 'INVITED';
  return 'EMPTY';
};

export const delay = (timeout: number) =>
  new Promise((rv) => {
    setTimeout(rv, timeout);
  });

export const excludeNullUndefined = <T>(
  value: T | null | undefined,
): value is T => value !== null && value !== undefined;
