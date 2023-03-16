'use strict';

import 'dotenv/config';

import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyEsso from 'fastify-esso';

import { publicRoutes } from './publicRoutes.mjs';
import { privateRoutes } from './privateRoutes.mjs';

fastify()
  .register(cors)
  .register(fastifyEsso({
    secret: process.env.ESSO_SECRET,
    extra_validation: async (req, _reply) => {
      if (!req.auth.valid) {
        throw Error('bearer token not valid');
      }
    }
  }))
  .register(publicRoutes)
  .register(privateRoutes)
  .listen({ port: process.env.BACKEND_PORT }).then(address => {
    console.log(address);
  });
