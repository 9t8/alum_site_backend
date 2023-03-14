'use strict';
import dotenv from 'dotenv';
dotenv.config();

import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyEsso from 'fastify-esso';

import { publicRoutes } from './publicRoutes.mjs';
import { privateRoutes } from './privateRoutes.mjs';

fastify()
  .register(cors)
  .register(fastifyEsso({ secret: process.env.ESSO_SECRET }))
  .register(publicRoutes)
  .register(privateRoutes)
  .listen({ port: process.env.BACKEND_PORT }).then(address => {
    console.log(address);
  });
