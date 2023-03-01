'use strict';

import crypto from 'crypto';
import fastifyAuth from '@fastify/auth';
import connect, { sql } from '@databases/sqlite-sync';
import nodemailer from 'nodemailer';
import fastify from 'fastify';

const hash_pw = req_body =>
  crypto.scryptSync(
    req_body.password, 'gunn-alumni/backend/' + req_body.email,
    128,
    { p: 5 }
  );

const auth_pw = [
  (req, _reply, done) => {
    if (!req.body || !req.body.email) {
      done(Error('missing email in request body'));
      return;
    }

    const pws = db.query(sql`
SELECT password FROM users WHERE email=${req.body.email}`
    );
    if (pws.length !== 1 || !crypto.timingSafeEqual(pws[0].password, hash_pw(req.body))) {
      done(Error('incorrect password'));
    }
    done();
  }
];

const auth_tok = [
  (req, _reply, done) => {
    done(Error('TODO'));
  }
];

const db = connect('db.sqlite3');

const transporter = nodemailer.createTransport({
  streamTransport: true
});

const server = fastify();
server.register(fastifyAuth);

server.after(() => {
  // no auth

  server.route({
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
      // todo: check that user does not exist
      db.query(sql`
REPLACE INTO users(email, password)
VALUES(${req.body.email}, ${hash_pw(req.body)})`
      );
      reply.send();
    }
  });

  server.route({
    method: 'POST',
    url: '/reset-pw',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' }
        },
        required: ['email']
      }
    },
    handler: (_req, reply) => {
      transporter.sendMail({
        from: 'fakeauth@gunnalum.site',
        to: 'fakeuser@example.com',
        subject: 'Fake Password Reset',
        text: 'test email text.'
      }, (_err, info) => info.message.pipe(process.stdout));

      reply.send({ tok: 'TODO' });
    }
  });

  // require password

  server.route({
    method: 'POST',
    url: '/auth',
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
    preHandler: server.auth(auth_pw),
    handler: (_req, reply) => reply.send({ tok: 'TODO' })
  });

  // require tok

  server.route({
    method: 'POST',
    url: '/test-tok',
    preHandler: server.auth(auth_tok),
    handler: (_req, reply) => reply.send({ content: 'successfully authenticated' })
  });
});

server.listen({ port: 3000 }, err => {
  if (err) {
    throw err;
  }
});
