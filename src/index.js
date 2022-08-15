require('dotenv').config()

const express = require('express')
const expressPino = require('express-pino-logger')
const logger = require('./logger')
const healthcheckController = require('./controllers/healthcheck')
const v1Controller = require('./controllers/v1')

const PORT = process.env.SERVER_PORT || process.env.PORT || 80

const app = express()
app.use(express.json())
app.use(expressPino({ logger }))
app.use('/', healthcheckController)
app.use('/v1', v1Controller)

app.listen(PORT, (error) => {
  if (error) {
    logger.error(error, 'Error starting the server')
    process.exit(0)
  } else {
    logger.info('Server is listening on port %d', PORT)
  }
})

process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught Exception')
  logger.info('HTTP server closed')
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  logger.error(error, 'Unhandled Promise Rejection')
  logger.info('HTTP server closed')
  process.exit(1)
})
