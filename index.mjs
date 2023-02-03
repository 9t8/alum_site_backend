/*
Register a user:
    curl -i 'http://127.0.0.1:3000/register' -H 'content-type: application/json' --data '{"user": "myuser","password":"mypass"}'
The application then inserts user in the leveldb
Check it's all working
    curl 'http://127.0.0.1:3000/auth-multiple' -H 'content-type: application/json' --data '{"user": "myuser","password":"mypass"}'
 */

'use strict'

import Fastify from 'fastify'
import LevelDB from '@fastify/leveldb'
import Auth from '@fastify/auth'

const fastify = Fastify({ logger: true })

fastify.register(LevelDB, { name: 'authdb' })
fastify.register(Auth)
fastify.after(routes)

function verifyUserAndPassword(request, _reply, done) {
  if (!request.body || !request.body.user) {
    return done(new Error('Missing user in request body'))
  }

  this.level.authdb.get(request.body.user, onUser)

  function onUser(err, password) {
    if (err) {
      if (err.notFound) {
        return done(new Error('Password not valid'))
      }
      return done(err)
    }

    if (!password || password !== request.body.password) {
      return done(new Error('Password not valid'))
    }

    done()
  }
}

function routes() {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: {
        type: 'object',
        properties: {
          user: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['user', 'password']
      }
    },
    handler: (req, reply) => {
      req.log.info('Creating new user')
      fastify.level.authdb.put(req.body.user, req.body.password, err => reply.send(err))
    }
  })

  fastify.route({
    method: 'POST',
    url: '/auth-multiple',
    preHandler: fastify.auth([
      verifyUserAndPassword
    ]),
    handler: (req, reply) => {
      req.log.info('Auth route')
      reply.send({ hello: 'world' })
    }
  })
}

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
