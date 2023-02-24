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

const auth_pw = [
  (req, _reply, done) => {
    if (!req.body || !req.body.email) {
      done(Error('missing email in request body'));
      return;
    }

    const pws = db.query(sql`
SELECT password FROM users WHERE email=${req.body.email}`
    );
    if (pws.length !== 1 || pws[0].password.compare(hash_pw(req.body))) {
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

const fastify = Fastify();
fastify.register(Auth);

fastify.after(() => {
  // no auth

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
      // todo: check that user does not exist
      db.query(sql`
REPLACE INTO users(email, password)
VALUES(${req.body.email}, ${hash_pw(req.body)})`
      );
      reply.send();
    }
  });

  // require password

  fastify.route({
    method: 'POST',
    url: '/auth',
    preHandler: fastify.auth(auth_pw),
    handler: (_req, reply) => reply.send({ tok: 'TODO' })
  });

  fastify.route({
    method: 'POST',
    url: '/reset-pw',
    preHandler: fastify.auth(auth_pw),
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

  // require tok

  fastify.route({
    method: 'POST',
    url: '/test-tok',
    preHandler: fastify.auth(auth_tok),
    handler: (_req, reply) => reply.send({ content: 'successfully authenticated' })
  });
});

fastify.listen({ port: 3000 }, err => {
  if (err) {
    throw err;
  }
});
