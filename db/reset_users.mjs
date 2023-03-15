'use strict';

import 'dotenv/config';

import connect, { sql } from '@databases/sqlite-sync';

connect(process.env.DB_PATH).query(sql`
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  email TEXT NOT NULL UNIQUE,
  password BLOB NOT NULL
) STRICT`
);
