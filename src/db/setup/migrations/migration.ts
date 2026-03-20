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
  const result = (await connection.query(`
    select *
    from nodes n 
    where n.count_of_members > 0;
`)) as any[];

  for (const node of result) {
    for (let i = 6; i < 12; i++) {
      const sql = `
      insert into nodes (
        node_level,
        parent_node_id,
        net_id,
        node_position
      )
      values (
        ${node.node_level + 1},
        ${node.node_id},
        ${node.net_id},
        ${i}
      );
    `;
      await connection.query(sql);
    }
  }
};

exec();
