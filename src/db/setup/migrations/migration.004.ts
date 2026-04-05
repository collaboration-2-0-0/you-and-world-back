import Connection from '../../connection/pg';

const connection = new Connection({
  host: 'localhost',
  port: 5432,
  database: 'you_and_world',
  user: 'you_and_world',
  password: 'you_and_world',
  /* heroku */
  // ssl: { rejectUnauthorized: false },
  // connectionString: '',
});

const exec = async () => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS public.spaces (
      space_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
      name character varying(50) NOT NULL,
      description text DEFAULT NULL,
      CONSTRAINT pk_spaces PRIMARY KEY (space_id)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS public.spaces_to_spaces (
      space_rel_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
      space_id integer NOT NULL,
      parent_space_id integer DEFAULT NULL,
      CONSTRAINT pk_spaces_to_spaces PRIMARY KEY (space_rel_id),
      CONSTRAINT fk_spaces_to_spaces_space FOREIGN KEY (space_id)
        REFERENCES public.spaces (space_id),
      CONSTRAINT fk_spaces_to_spaces_parent FOREIGN KEY (parent_space_id)
        REFERENCES public.spaces (space_id)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS public.members_info (
      member_id integer NOT NULL,
      member_desire text DEFAULT NULL,
      member_goal text DEFAULT NULL,
      member_activity text DEFAULT NULL,
      member_role character varying(50) DEFAULT NULL,
      CONSTRAINT pk_members_info PRIMARY KEY (member_id),
      CONSTRAINT fk_members_info_member FOREIGN KEY (member_id)
        REFERENCES public.members (member_id) ON DELETE CASCADE
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS public.members_spaces (
      member_id integer NOT NULL,
      space_rel_id integer NOT NULL,
      CONSTRAINT pk_members_spaces PRIMARY KEY (member_id, space_rel_id),
      CONSTRAINT fk_members_spaces_member FOREIGN KEY (member_id)
        REFERENCES public.members (member_id) ON DELETE CASCADE,
      CONSTRAINT fk_members_spaces_space_rel FOREIGN KEY (space_rel_id)
        REFERENCES public.spaces_to_spaces (space_rel_id)
    );
  `);

  console.log('migration.004 done');
};

exec();
