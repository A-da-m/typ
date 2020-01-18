import server from './server'

process.env.NODE_ENV = process.argv.includes('--development')
  ? 'development'
  : 'production'

process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`)
})

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason: any) => {
  console.error(`unhandledRejection ${reason}`)
})

const start = async () => {
  const web = await server()
  await web.listen(3000)
  console.log(`[typ] Server running on port: 3000`)
}

start() // tslint:disable-line
