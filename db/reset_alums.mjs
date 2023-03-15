'use strict';

import 'dotenv/config';

import connect, { sql } from '@databases/sqlite-sync';

connect(process.env.DB_PATH).query(sql`
DROP TABLE IF EXISTS alums;

CREATE TABLE alums (
  name TEXT NOT NULL,
  year INT NOT NULL
) STRICT;

INSERT INTO alums VALUES
  ('Bobby Boomer', 2000),
  ('David Li', 2024),
  ('Veeee Eeeer', 2024),
  ('Zobby Zoomer', 2040),
  ('Gunn Alumni Dylan', 1984)`
);
