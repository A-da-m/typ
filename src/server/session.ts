import sessions from './models/session'
import fastifySession from 'fastify-session'

export default (server: any): fastifySession.SessionStore => {
  const Store = server.Store || server.session.Store
  class SessionStore extends Store {
    get (_id: string, cb: any) {
      return sessions.findById(_id).lean().exec((error: Error, session: any) => {
        if (error) return cb(error)
        return cb(null, session && session.data ? session.data : null)
      })
    }

    set (_id: string, data: any, cb: any) {
      if (!data) return sessions.findByIdAndDelete({ _id }, cb)
      return sessions.findByIdAndUpdate(_id, { data, expires: new Date() }, { upsert: true }, cb)
    }

    destroy (_id: string, cb: any) {
      console.log(_id)
      return sessions.findByIdAndDelete(_id, cb)
    }
  }
  return new SessionStore()
}
