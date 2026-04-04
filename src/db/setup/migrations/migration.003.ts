import Connection from '../../connection/pg';

const connection = new Connection({
  host: 'localhost',
  port: 5432,
  database: 'you_and_world',
  user: 'you_and_world',
  password: 'you_and_world',
});

const exec = async () => {
  await connection.query(`
    ALTER TABLE public.nodes ADD COLUMN IF NOT EXISTS node_address character varying;
  `);

  await connection.query(`
    WITH RECURSIVE addr AS (
      SELECT node_id, '0'::varchar AS node_address
      FROM nodes WHERE parent_node_id IS NULL
      UNION ALL
      SELECT n.node_id,
        CASE WHEN a.node_address = '0' THEN (n.node_position + 1)::varchar
             ELSE a.node_address || '.' || (n.node_position + 1)::varchar END
      FROM nodes n JOIN addr a ON n.parent_node_id = a.node_id
    )
    UPDATE nodes SET node_address = addr.node_address
    FROM addr WHERE nodes.node_id = addr.node_id;
  `);

  await connection.query(`
    ALTER TABLE public.nodes ALTER COLUMN node_address SET NOT NULL;
  `);

  console.log('migration.003 done');
};

exec();
