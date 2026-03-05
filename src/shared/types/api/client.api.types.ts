export type TAccountLogin_tg = {
  initData: string;
};
export type TAccountSignup_tg = {
  initData: string;
};
export type TAdminDisconnectNotVote = {
  monthAgo: number;
};
export type TAdminDisconnectUnactive = {
  monthAgo: number;
};
export type TAdminNetGetResponse = {
};
export type TBotMessage = {
  chatId: number;
  netId?: number;
  message?: undefined;
};
export type TBotMessageResponse = {
  message?: string;
} | boolean;
export type TEventsRead = {
  event_id?: number;
};
export type TEventsConfirm = {
  event_id: number;
};
export type TMemberDataVoteSetResponse = boolean | null;
export type TMemberInviteCreateResponse = string | null;
export type TNetInvite = {
  node_id: number;
  user_id: number;
};
export type TNetInviteResponse = string | null;
