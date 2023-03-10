'use strict';
import dotenv from 'dotenv';
dotenv.config();

import connect, { sql } from '@databases/sqlite-sync';

const db = connect(process.env.DB_PATH);

db.query(sql`DROP TABLE IF EXISTS alums`);

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
  ('Zobby Zoomer', 2040),
  ('Gunn Alumni Dylan', 1984)`
);
