'use strict';
import dotenv from 'dotenv';
dotenv.config();

export async function privateRoutes(server) {
  server.requireAuthentication(server);

  server.get(
    '/test-tok',
    async (req, _reply) => {
      return { content: req.auth.email + ' successfully authenticated' };
    }
  );
}
