import 'dotenv/config';

import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import fastifyEsso from 'fastify-esso';
import { sql } from '@databases/sqlite-sync';

import db from './db.mjs';
import publicRoutes from './publicRoutes.mjs';
import privateRoutes from './privateRoutes.mjs';

fastify()
  .register(cors)
  .register(fastifyFormbody)
  .register(fastifyEsso({
    secret: process.env.ESSO_SECRET,
    extra_validation: async (req, _reply) => { // switch
      if (!req.auth.valid || !Buffer.from(req.auth.password).equals(db.query(sql`
        SELECT password FROM users WHERE id = ${req.auth.id}
      `)[0].password)) {
        throw Error('authentication failed');
      }
    },
  }))
  .register(publicRoutes)
  .register(privateRoutes)
  .listen({ port: process.env.BACKEND_PORT })
  .then((address) => {
    console.log(address);
  });
