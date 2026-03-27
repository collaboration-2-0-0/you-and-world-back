import { RULES_DEFAULT } from '@root/constants/rules.md';
import Connection from '../../connection/pg';

const connection = new Connection({
  host: 'localhost',
  port: 5432,
  database: 'you_and_world',
  user: 'you_and_world',
  password: 'you_and_world',
  /* heroku */
  ssl: { rejectUnauthorized: false },
  connectionString: '',
});

const exec = async () => {
  let result = (await connection.query(`
    ALTER TABLE public.nets_data ADD IF NOT EXISTS rules text DEFAULT NULL::character varying NULL;
`)) as any[];

  result = (await connection.query(
    `
    UPDATE nets_data SET rules = $1;
`,
    [RULES_DEFAULT],
  )) as any[];

  console.log(result);
};

exec();
