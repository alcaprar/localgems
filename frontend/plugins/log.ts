import { pino, type Logger } from 'pino'

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      log: function (): Logger {
        const logger = pino({
          level: 'debug'
        })

        return logger
      }
    }
  }
})
