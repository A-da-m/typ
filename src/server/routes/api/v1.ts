import bots from '../../models/bots'
import users from '../../models/users'
import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import axios from 'axios'
import sanitize from '../../sanitize'
const hookcord = require('hookcord')
export default (server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>, options: any, next: any) => {
  server.get('/bots', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    const query: any = {}
    if (request.query.ownerID) query.ownerID = sanitize(request.query.ownerID)
    if (request.query.search) query.$text = { $search: sanitize(request.query.search) }
    return bots.find(query)
      .then(result => reply.send(result))
      .catch(error => reply.send(error))
  })

  server.get('/users/:id', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    if (!request.params.id) return reply.send('Missing userID').code(400)
    return users.findOne({ id: sanitize(request.params.id) })
      .then(user => {
        return bots.find({ ownerID: sanitize(request.params.id) })
          .then(bots => {
            return reply.send({ user, bots })
          })
      })
      .catch(error => reply.send(error))
  })

  server.get('/bots/:id', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    if (!request.params.id) return reply.send('Missing botID').code(400)
    return bots.findOne({ id: sanitize(request.params.id) })
      .then((bot: any) => {
        return users.findOne({ id: sanitize(bot.ownerID) })
          .then((user: any) => {
            return reply.send({ bot, owner: { username: user?.username, discriminator: user?.discriminator, avatar: user?.avatar } })
          })
          .catch(error => reply.send(error))
      })
      .catch(error => reply.send(error))
  })

  server.post('/bots/:id', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    if (!request.session?.user) return reply.send('Unauthorized').code(401)
    if (!request.params.id || !request.body.description?.short || !request.body.description?.long || request.body.new) return reply.send('Missing content').code(400)
    return axios.get(`https://discordapp.com/api/users/${request.params.id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    })
      .then(({ data }) => {
        const query: any = {
          ownerID: sanitize(request.session.user?.id),
          username: sanitize(data.username),
          discriminator: sanitize(data.discriminator),
          avatar: sanitize(data.avatar),
          tags: [],
          description: {
            short: sanitize(request.body.description.short),
            long: sanitize(request.body.description.long)
          },
          banner: sanitize(request.body.banner) || null,
          featured: 0,
          certified: false,
          invite: sanitize(request.body.invite || `https://discordapp.com/api/oauth2/authorize?client_id=${request.params.id}&permissions=0&scope=bot`),
          public: sanitize(request.body.public),
          approved: false,
          date: new Date()
        }
        if (!request.body.new) {
          delete query.approved
          delete query.date
          delete query.certified
          delete query.featured
        }
        return bots.findOneAndUpdate({
          id: sanitize(request.params.id)
        }, query, {
          upsert: true
        })
          .then(() => {
            new hookcord.Hook()
              .login(process.env.HOOK_ID, process.env.HOOK_SECRET)
              .setPayload({
                'content': request.body.new ? '<@&666799016679309312>' : '',
                'embeds': [{
                  'title': request.body.new ? '**Bot Added**' : '**Bot Updated**',
                  'description': `<@${request.session.user.id}> \`${request.session.user.username}#${request.session.user.discriminator}\` ${request.body.new ? 'added' : 'updated'} <@${data.id}> \`${data.username}#${data.discriminator}\``,
                  'fields': [{
                    'name': 'Description',
                    'value': request.body.description.short,
                    'inline': true
                  }, {
                    'name': 'Link',
                    'value': `https://typapp.co/bot/${data.id}`,
                    'inline': true
                  }],
                  'timestamp': new Date()
                }]
              })
              .fire()
              .catch((error: Error) => { console.error(error) })
            return reply.send({ username: data.username, discriminator: data.discriminator, id: request.params.id }).code(200)
          })
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

  server.get('/admins', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    return users.find({ admin: { $gt: 0 } }).then(admins => reply.send({ admins }))
  })

  server.get('/admins/:id', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    return users.findOne({ id: sanitize(request.params.id), admin: { $gt: 0 } }).then(admin => reply.send({ admin }))
  })

  server.post('/admin/bots/:id/:status', async (request: fastify.FastifyRequest, reply: fastify.FastifyReply<unknown>) => {
    if (!request.session?.user) return reply.send('Unauthorized').code(401)
    // tslint:disable-next-line: await-promise
    const user: any = await users.findOne({ id: sanitize(request.session.user.id) })
    if (!user?.admin) return reply.send('Unauthorized').code(401)
    if (!request.params.id || !request.params.status) return reply.send('Missing content').code(400)
    return bots.findOneAndUpdate({ id: sanitize(request.params.id) }, { approved: request.params.status === 'approved' })
      .then(() => reply.code(204))
      .catch(error => reply.send(error).code(500))
  })
  next()
}
