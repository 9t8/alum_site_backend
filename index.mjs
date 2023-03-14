'use strict';
import dotenv from 'dotenv';
dotenv.config();

import connect, { sql } from '@databases/sqlite-sync';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyEsso from 'fastify-esso';

const db = connect(process.env.DB_PATH);

const hash = req_body =>
  crypto.scryptSync(
    req_body.password, 'gunn-alumni/backend/' + req_body.email,
    128,
    { p: 5 }
  );

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
  .register(cors)
  .register(fastifyEsso({ secret: process.env.ESSO_SECRET }))
  .register(privateRoutes);

server.after(() => {
  server.get(
    '/alums',
    async (req, _reply) => {
      let query;
      if (req.query.beginYear) {
        if (req.query.endYear) {
          query = sql`
          SELECT name, year FROM alums
          WHERE year BETWEEN ${req.query.beginYear} AND ${req.query.endYear}
          ORDER BY name`;
        } else {
          query = sql`
          SELECT name, year FROM alums
          WHERE year >= ${req.query.beginYear}
          ORDER BY name`;
        }
      } else if (req.query.endYear) {
        query = sql`
        SELECT name, year FROM alums
        WHERE year <= ${req.query.endYear}
        ORDER BY name`;
      }
      query ||= sql`SELECT name, year FROM alums ORDER BY name`;

      const results = {};
      for (const alum of db.query(query)) {
        if (!results[alum.year]) {
          results[alum.year] = [];
        }
        results[alum.year].push((({ year, ...rest }) => rest)(alum));
      }
      return results;
    }
  );

  server.post(
    '/register',
    async (req, _reply) => {
      if (db.query(sql`
      SELECT email FROM users WHERE email=${req.body.email}`
      ).length !== 0) {
        return Error('user already exists');
      }

      db.query(sql`
      INSERT INTO users (email, password) VALUES
        (${req.body.email}, ${hash(req.body)})`
      );
      return;
    }
  );

  server.post(
    '/reset-pw',
    async (req, _reply) => {
      // todo: make this work
      transporter.sendMail({
        from: 'fakeauth@gunnalum.site',
        to: req.body.email,
        subject: 'WEBSITE NAME Password Reset',
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

      if (pws.length !== 1 || !crypto.timingSafeEqual(pws[0].password, hash(req.body))) {
        return Error('incorrect password');
      }
      // fixme: make more secure
      return server.generateAuthToken({ email: req.body.email });
    }
  );
}).listen({ port: process.env.BACKEND_PORT }).then(address => {
  console.log(address);
});
