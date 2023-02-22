'use strict';

import connect, { sql } from '@databases/sqlite-sync';

const db = connect('db.sqlite3');

db.query(sql`
CREATE TABLE IF NOT EXISTS alums (
  name TEXT NOT NULL,
  year INT NOT NULL
) STRICT`)

db.query(sql`
CREATE TABLE IF NOT EXISTS users (
  email TEXT NOT NULL UNIQUE,
  password BLOB NOT NULL UNIQUE
) STRICT`
);
