'use strict';

import 'dotenv/config';

import connect, { sql } from '@databases/sqlite-sync';

connect(process.env.DB_PATH).query(sql`
  DROP TABLE IF EXISTS people;

  CREATE TABLE people (
    id INT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    grad_year INT
  ) STRICT;

  INSERT INTO people (id, name, grad_year) VALUES
    (0, 'Bobby Boomer', 2000),
    (1, 'David Li', 2024),
    (2, 'Veeee Eeeer', 2024),
    (3, 'Zobby Zoomer', 2040),
    (4, 'Gunn Alumni Dylan', 1984)
`);
