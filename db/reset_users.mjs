'use strict';

import connect, { sql } from '@databases/sqlite-sync';

const db = connect('db.sqlite3');

db.query(sql`DROP TABLE users`);

db.query(sql`
CREATE TABLE users (
  email TEXT NOT NULL UNIQUE,
  password BLOB NOT NULL UNIQUE
) STRICT`
);
