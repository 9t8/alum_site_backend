import 'dotenv/config';

import connect, { sql } from '@databases/sqlite-sync';

connect(process.env.DB_PATH).query(sql`
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id INT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password BLOB NOT NULL,
    bio TEXT NOT NULL
  ) STRICT;

  INSERT INTO users (id, email, password, bio) VALUES
    (0, '', x'', '');

  DROP TABLE IF EXISTS people;

  CREATE TABLE people (
    name TEXT NOT NULL,
    grad_year INT,
    user_id INT UNIQUE
  ) STRICT;

  INSERT INTO people (name, grad_year, user_id) VALUES
    ('Bobby Boomer', 2000, 1234),
    ('David Li', 2024, 1235),
    ('Veeee Eeeer', 2024, 1236),
    ('Zobby Zoomer', 2040, 1237),
    ('Gunn Alumni Dylan', 1984, 1238),
    ('Shitty Staff', NULL, NULL),
    ('Example User', 1999, 1239)
`);
