export default async function privateRoutes(server) {
  server.requireAuthentication(server);

  server.get(
    '/test-tok',
    async (req, _reply) => ({
      content: 'successfully authenticated',
      token: req.auth,
    }),
  );
}
