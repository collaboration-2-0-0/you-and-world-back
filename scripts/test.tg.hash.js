const { createHmac } = require('crypto');
const { TG_BOT_TOKEN, TG_QUERY_STRING } = require('../.env.json');

const query_string = TG_QUERY_STRING;
const queryObj = new URLSearchParams(query_string);
const hash = queryObj.get('hash');
queryObj.delete('hash');
const checkString = [...queryObj.entries()]
  .sort(([a], [b]) => (a > b ? 1 : -1))
  .map(([key, val]) => `${key}=${val}`)
  .join('\n');

const algorithm = 'sha256';
const key1 = 'WebAppData';
const key2 = createHmac(algorithm, key1).update(TG_BOT_TOKEN).digest();
const result = createHmac(algorithm, key2).update(checkString).digest('hex');

console.log(hash);
console.log(result);

if (result === hash) console.log('success');
