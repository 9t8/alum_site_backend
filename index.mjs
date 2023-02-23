'use strict';

import { scryptSync } from 'crypto';
import Auth from '@fastify/auth';
import connect, { sql } from '@databases/sqlite-sync';
import nodemailer from 'nodemailer';
import Fastify from 'fastify';

const hash_pw = req_body =>
  scryptSync(
    req_body.password, 'gunn-alumni/backend/' + req_body.email,
    128,
    { p: 5 }
  );

const auth_functions = [
  (req, _reply, done) => {
    if (!req.body || !req.body.email) {
      done(new Error('Missing email in request body'));
      return;
    }

    const pws = db.query(sql`
SELECT password FROM users WHERE email=${req.body.email}`
    );
    if (pws.length !== 1 || pws[0].password.compare(hash_pw(req.body))) {
      done(new Error('Password not valid'));
    }
    done();
  }
];

const db = connect('db.sqlite3');

const transporter = nodemailer.createTransport({
  streamTransport: true
});

transporter.sendMail({
  from: 'fakeauth@gunnalum.site',
  to: 'recipient@example.com',
  subject: 'Fake Password Reset',
  text: ':o'
}, (_err, info) => info.message.pipe(process.stdout));

const fastify = Fastify();
fastify.register(Auth);

fastify.after(() => {
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
VALUES(${req.body.email}, ${hash_pw(req.body)})`
      );
      reply.send();
    }
  });

  fastify.route({
    method: 'POST',
    url: '/',
    preHandler: fastify.auth(auth_functions),
    handler: (_req, reply) => reply.send({ hello: 'world' })
  });
});

fastify.listen({ port: 3000 }, err => {
  if (err) {
    throw err;
  }
});
