import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import axios from 'axios'
import users from '../models/users'

export default (server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>, options: any, next: any) => {
  server.get('/state', async (request, reply) => reply.send(request?.session?.user))

  server.get('/callback', async (request, reply) => {
    // @ts-ignore
    server.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request, (error, results) => {
      if (error) return reply.send(error).code(500)
      if (!results?.access_token) return reply.send('Invaild access token').code(500)
      return axios.get('https://discordapp.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${results.access_token}`
        }
      })
        .then(async (user) => {
          if (!user?.data) return reply.send('Invaild user object').code(500)
          request.session.user = {
            ...user.data,
            access_token: results.access_token
          }
          // tslint:disable-next-line: await-promise
          await users.findOneAndUpdate({ id: user.data.id }, {
            username: user.data.username,
            discriminator: user.data.discriminator,
            avatar: user.data.avatar
          }, { upsert: true })
          return reply.redirect('/')
        })
        .catch(error => reply.send(error).code(500))
    })
  })

  server.get('/logout', async (request, reply) => {
    console.log(request.session)
    return request.sessionStore.destroy(request.session.sessionId, (error) => {
      if (error) return reply.send(error).code(500)
      return reply.send({ session : request.session })
    })
  })

  next()
}
