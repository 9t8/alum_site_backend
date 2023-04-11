import 'dotenv/config';

import connect, { sql } from '@databases/sqlite-sync';

connect(process.env.DB_PATH).query(sql`
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS people;
`);
