'use strict';

import crypto from 'crypto';
import connect, { sql } from '@databases/sqlite-sync';
import nodemailer from 'nodemailer';
import fastify from 'fastify';
import fastifyEsso from 'fastify-esso';

const hash_pw = req_body =>
  crypto.scryptSync(
    req_body.password, 'gunn-alumni/backend/' + req_body.email,
    128,
    { p: 5 }
  );

const db = connect('db.sqlite3');

const transporter = nodemailer.createTransport({
  streamTransport: true
});

async function privateRoutes(server) {
  server.requireAuthentication(server);

  server.route({
    method: 'POST',
    url: '/test-tok',
    handler: (req, reply) => reply.send({ content: req.auth.email + ' successfully authenticated' })
  });
}

const server = fastify();
server.register(fastifyEsso({ secret: 'fixme: set up secret' }));
server.register(privateRoutes);

server.after(() => {
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
      // fixme: check that user does not exist
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

  server.post( // todo: add schema?
    '/auth',
    async (req, _reply) => {
      if (!req.body || !req.body.email) {
        return Error('missing email in request body');
      }

      const pws = db.query(sql`
      SELECT password FROM users WHERE email=${req.body.email}`
      );

      if (pws.length !== 1 || !crypto.timingSafeEqual(pws[0].password, hash_pw(req.body))) {
        return Error('incorrect password');
      }
      // fixme: make more secure
      return server.generateAuthToken({ email: req.body.email });
    }
  );
});

server.listen({ port: 3000 }, err => {
  if (err) {
    throw err;
  }
});
