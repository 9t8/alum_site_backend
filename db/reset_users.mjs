'use strict';
import dotenv from 'dotenv';
dotenv.config();

import connect, { sql } from '@databases/sqlite-sync';

const db = connect(process.env.DB_PATH);

db.query(sql`DROP TABLE IF EXISTS users`);

db.query(sql`
CREATE TABLE users (
  email TEXT NOT NULL UNIQUE,
  password BLOB NOT NULL
) STRICT`
);
