import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import fastifySession from 'fastify-session'
import fastifyCookie from 'fastify-cookie'

import { Server, IncomingMessage, ServerResponse } from 'http'

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import mongoose from 'mongoose'

import Store from './session'

import v1 from './routes/api/v1'
import auth from './routes/auth'
import bots from './models/bots'
import sanitize from './sanitize'

const oauth2 = require('fastify-oauth2')

require('dotenv').config()

export default async (): Promise<fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>> => {
  if (process.env.NODE_ENV === 'development') {
    require('./webpack.js')
  }

  mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).catch(error => console.log(error))
  mongoose.set('useFindAndModify', false)

  const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({})

  server.register(fastifyCookie)
  server.register(fastifySession, {
    cookieName: 'typID',
    cookie: { secure: false },
    secret: process.env.SECRET_TOKEN,
    store: Store(fastifySession),
    saveUninitialized: false
  })
  server.register(oauth2, {
    name: 'discordOAuth2',
    scope: ['identify'],
    credentials: {
      client: {
        id: process.env.DISCORD_ID,
        secret: process.env.DISCORD_SECRET
      },
      auth: {
        authorizeHost: 'https://discordapp.com',
        authorizePath: '/api/oauth2/authorize',
        tokenHost: 'https://discordapp.com',
        tokenPath: '/api/oauth2/token'
      }
    },
    callbackUri: process.env.NODE_ENV === 'production' ? 'https://typapp.co/auth/callback' : 'http://localhost:3000/auth/callback',
    startRedirectPath: '/auth/login'
  })

  server.register((instance, options, next) => {
    instance.register(fastifyStatic, {
      root: path.join(process.cwd(), 'public', 'images'),
      prefix: '/images'
    })
    next()
  })

  server.register((instance, options, next) => {
    instance.register(fastifyStatic, {
      root: path.join(__dirname, 'build'),
      prefix: '/app'
    })
    instance.get('/*', async (request, reply) => {
      const page = path.join(__dirname, 'build', 'index.html')
      if (request.req.url.includes('/bot/')) {
        // tslint:disable-next-line: await-promise
        const bot: any = await bots.findOne({ id: sanitize(request.req.url.replace('/bot/', '')) })
        return fs.readFile(page, 'utf8', (error, data) => {
          if (error) return reply.code(500).send({ error })
          data = data.replace(new RegExp('__TITLE__', 'g'), `${bot.username} - typ`)
          data = data.replace(new RegExp('__DESCRIPTION__', 'g'), bot.description.short)
          data = data.replace(new RegExp('__URL__', 'g'), `https://typapp.co/bot/${bot.id}`)
          data = data.replace(new RegExp('__IMAGE__', 'g'), bot.banner)
          return reply.send(data)
        })
      }
      return fs.readFile(page, 'utf8', (error, data) => {
        if (error) return reply.code(500).send({ error })
        data = data.replace(new RegExp('__TITLE__', 'g'), 'typ')
        data = data.replace(new RegExp('__DESCRIPTION__', 'g'), 'Bot Lists. Reinvented.')
        data = data.replace(new RegExp('__URL__', 'g'), 'https://typapp.co')
        return reply.send(data)
      })
    })
    next()
  })

  server.register(v1, {
    prefix: '/v1'
  })

  server.register(auth, {
    prefix: '/auth'
  })

  return server
}
