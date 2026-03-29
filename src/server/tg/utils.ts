export const getUrlFromArg = (origin: string, token: string) => {
  const pathBase64 = token.match(/^path(.+)$/)?.[1];
  if (!pathBase64) return;
  const path = Buffer.from(pathBase64, 'base64').toString();
  return `${origin}${path}`;
};
