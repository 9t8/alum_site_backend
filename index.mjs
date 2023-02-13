// https://www.npmjs.com/package/@databases/sqlite
/*
Register a user:
  curl -i "http://127.0.0.1:3000/register" -H "content-type: application/json" --data "{\"user\": \"myuser\",\"password\":\"mypass\"}"
The application then inserts user in the leveldb
Check it's all working
  curl "http://127.0.0.1:3000/auth" -H "content-type: application/json" --data "{\"user\": \"myuser\",\"password\":\"mypass\"}"
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
fastify.after(routes);

function verifyUserAndPassword(request, _reply, done) {
  if (!request.body || !request.body.user) {
    done(new Error('Missing user in request body'));
    return;
  }

  const pws = db.query(sql`
SELECT password FROM users WHERE email=${request.body.user};`
  );
  if (pws.length !== 1 || pws[0].password !== request.body.password) {
    done(new Error('Password not valid'));
  }
  done();
}

function routes() {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: {
        type: 'object',
        properties: {
          user: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['user', 'password']
      }
    },
    handler: (req, reply) => {
      req.log.info('Creating new user');
      db.query(sql`
REPLACE INTO users(email, password)
VALUES(${req.body.user}, ${req.body.password});`
      );
      reply.send();
    }
  })

  fastify.route({
    method: 'POST',
    url: '/auth',
    preHandler: fastify.auth([verifyUserAndPassword]),
    handler: (req, reply) => {
      req.log.info('Auth route');
      reply.send({ hello: 'world' });
    }
  })
}

fastify.listen({ port: 3000 }, err => {
  if (err) {
    throw err;
  }
})
