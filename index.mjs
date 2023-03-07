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

// todo: use mailjet to actually send emails
const transporter = nodemailer.createTransport({
  streamTransport: true
});

async function privateRoutes(server) {
  server.requireAuthentication(server);

  server.get(
    '/test-tok',
    async (req, _reply) => {
      return { content: req.auth.email + ' successfully authenticated' };
    }
  );
}

const server = fastify()
  .register(fastifyEsso({ secret: 'fixme: set up secret' }))
  .register(privateRoutes);

server.after(() => {
  server.get(
    '/alums',
    async (req, _reply) => {
      return { alums: db.query(sql`SELECT * FROM ALUMS`) };
    }
  );

  server.post(
    '/register',
    async (req, _reply) => {
      // fixme: comfirm that user does not exist
      db.query(sql`
REPLACE INTO users (email, password)
VALUES(${req.body.email}, ${hash_pw(req.body)})`
      );
      return;
    }
  );

  server.post(
    '/reset-pw',
    async (_req, _reply) => {
      // todo: make this work
      transporter.sendMail({
        from: 'fakeauth@gunnalum.site',
        to: 'fakeuser@example.com',
        subject: 'Fake Password Reset',
        text: 'test email text.'
      }, (_err, info) => info.message.pipe(process.stdout));

      return Error('fixme');
    }
  );

  server.post(
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

server.listen({ port: process.env.BACKEND_PORT }).then(address => {
  console.log(address);
});
