import { reportServerError } from './lib/server-health'

process.on('uncaughtException', (error) => {
  reportServerError('uncaughtException', error.message, { stack: error.stack })
})

process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason)
  const stack = reason instanceof Error ? reason.stack : undefined
  reportServerError('unhandledRejection', message, { stack })
})
