// https://www.npmjs.com/package/@databases/sqlite
/*
  Register a user:
curl -i "http://127.0.0.1:3000/register" -H "content-type: application/json" --data "{\"email\": \"myuser\",\"password\":\"mypass\"}"
  The application then inserts user in the db
  Check it's all working
curl "http://127.0.0.1:3000/auth" -H "content-type: application/json" --data "{\"email\": \"myuser\",\"password\":\"mypass\"}"
*/

'use strict';

import Fastify from 'fastify';
import Auth from '@fastify/auth';
import connect, { sql } from '@databases/sqlite-sync';

const db = connect();
db.query(sql`
CREATE TABLE users (
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
) STRICT`
);

const fastify = Fastify({ logger: true });
fastify.register(Auth);

const auth_functions = [
  (req, _reply, done) => {
    if (!req.body || !req.body.email) {
      done(new Error('Missing email in request body'));
      return;
    }

    const pws = db.query(sql`
SELECT password FROM users WHERE email=${req.body.email}`
    );
    if (pws.length !== 1 || pws[0].password !== req.body.password) {
      done(new Error('Password not valid'));
    }
    done();
  }
];

fastify.after(() => {
  fastify.route({
    method: 'GET',
    url: '/dumpusers',
    handler: (req, reply) => {
      console.table(db.query(sql`
SELECT * FROM users`
      ));
      reply.send();
    }
  });

  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['email', 'password']
      }
    },
    handler: (req, reply) => {
      db.query(sql`
REPLACE INTO users(email, password)
VALUES(${req.body.email}, ${req.body.password})`
      );
      reply.send();
    }
  });

  fastify.route({
    method: 'POST',
    url: '/auth',
    preHandler: fastify.auth(auth_functions),
    handler: (_req, reply) => {
      reply.send({ hello: 'world' });
    }
  });
});

fastify.listen({ port: 3000 }, err => {
  if (err) {
    throw err;
  }
});
