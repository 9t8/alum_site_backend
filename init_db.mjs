'use strict';

import connect, { sql } from '@databases/sqlite-sync';

const db = connect('db.sqlite3');

db.query(sql`
CREATE TABLE IF NOT EXISTS users (
  email TEXT NOT NULL UNIQUE,
  password BLOB NOT NULL UNIQUE
) STRICT`
);

db.query(sql`DROP TABLE alums`);
db.query(sql`
CREATE TABLE alums (
  name TEXT NOT NULL,
  year INT NOT NULL
) STRICT`
);
db.query(sql`
INSERT INTO alums VALUES
  ('Bobby Boomer', 2000),
  ('David Li', 2024),
  ('Veeee Eeeer', 2024),
  ('Zobby Zoomer', 2040)`
);
