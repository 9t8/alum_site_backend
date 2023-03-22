'use strict';

import connect, { sql } from '@databases/sqlite-sync';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export async function publicRoutes(server) {
  server.get(
    '/alums',
    async (req, _reply) => {
      let query;
      if (req.query.beginYear) {
        if (req.query.endYear) {
          query = sql`
            SELECT name, grad_year FROM people
            WHERE grad_year BETWEEN ${req.query.beginYear} AND ${req.query.endYear}
            ORDER BY name
          `;
        } else {
          query = sql`
            SELECT name, grad_year FROM people
            WHERE grad_year >= ${req.query.beginYear}
            ORDER BY name
          `;
        }
      } else if (req.query.endYear) {
        query = sql`
          SELECT name, grad_year FROM people
          WHERE grad_year <= ${req.query.endYear}
          ORDER BY name
        `;
      }
      query ||= sql`
        SELECT name, grad_year FROM people
        WHERE grad_year IS NOT NULL
        ORDER BY name
      `;

      const results = {};
      for (const alum of db.query(query)) {
        if (!results[alum.grad_year]) {
          results[alum.grad_year] = [];
        }
        results[alum.grad_year].push((({ grad_year, ...rest }) => rest)(alum));
      }
      return results;
    }
  );

  server.post(
    '/register',
    async (req, _reply) => {
      if (!Number.isInteger(req.body.person_id)) {
        return Error('person_id must be integral');
      }

      if (db.query(sql`
        SELECT email FROM users WHERE email=${req.body.email}
      `).length !== 0) {
        console.error('tried to create existing user');
        return;
      }

      if (db.query(sql`
        SELECT user_id FROM people WHERE oid = ${req.body.person_id}
      `)[0].user_id !== null) {
        return Error('person is taken');
      }

      const new_uid = db.query(sql`SELECT MAX(id) FROM users`)[0]['MAX(id)'] + 1;
      db.query(sql`
        INSERT INTO users (id, email, password) VALUES
          (${new_uid}, ${req.body.email}, ${hash(req.body)})
      `); // fixme change user_id
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
        SELECT password FROM users WHERE email=${req.body.email}
      `);

      if (pws.length !== 1 || !crypto.timingSafeEqual(pws[0].password, hash(req.body))) {
        return Error('incorrect password');
      }
      // fixme: make more secure
      return server.generateAuthToken({
        email: req.body.email,
        valid: 'yeah!'
      });
    }
  );
}
