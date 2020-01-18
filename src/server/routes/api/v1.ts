import bots from '../../models/bots'
import users from '../../models/users'
import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import axios from 'axios'
import sanitize from '../../sanitize'

export default (server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>, options: any, next: any) => {
  server.get('/bots', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    return bots.find({})
      .then(result => reply.send(result))
      .catch(error => reply.send(error))
  })

  server.get('/bots/:id', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    if (!request.params.id) return reply.send('Missing botID').code(400)
    return bots.findOne({ id: request.params.id })
      .then((bot: any) => {
        return users.findOne({ id: bot.ownerID })
          .then((user: any) => {
            return reply.send({ bot, owner: { username: user?.username, discriminator: user?.discriminator, avatar: user?.avatar } })
          })
          .catch(error => reply.send(error))
      })
      .catch(error => reply.send(error))
  })

  server.post('/bots/:id', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    if (!request.params.id || !request.body.description?.short || !request.body.description?.long) return reply.send('Missing content').code(400)
    return axios.get(`https://discordapp.com/api/users/${request.params.id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    })
      .then(({ data }) => {
        return bots.create({
          id: sanitize(request.params.id),
          ownerID: sanitize(request.session.user?.id),
          username: sanitize(data.username),
          discriminator: sanitize(data.discriminator),
          avatar: sanitize(data.avatar),
          tags: [],
          description: {
            short: sanitize(request.body.description.short),
            long: sanitize(request.body.description.long)
          },
          banner: null,
          featured: 0,
          certified: false,
          public: sanitize(request.body.public),
          approved: false
        })
          .then(() => reply.code(204))
          .catch(error => {
            console.log(error)
            return reply.send(error).code(500)
          })
      })
      .catch(error => {
        console.log(error)
        return reply.send(error).code(500)
      })
  })

  next()
}
