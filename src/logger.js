const { pino } = require('pino')

const localLogsConfig = {
  target: 'pino-pretty',
  options: {
    ignore: 'pid,hostname',
    translateTime: 'SYS:HH:MM:ss.l'
  }
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'production' ? false : localLogsConfig
})

module.exports = logger
