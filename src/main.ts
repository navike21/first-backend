import express from 'express'
import { connectDataBase } from './connection'
import { app, corsConfig } from './configurations'
import routers from './routers'
import {
  PORT,
  TRequest,
  TResponse,
  URL_ORIGINS,
  validateRequest
} from './common'
import { logger } from './logger'

app.use(express.json())

corsConfig()
async function startServer(): Promise<void> {
  try {
    const dbConnected: boolean = await connectDataBase()
    if (dbConnected) {
      logger.info('Database connected successfully')
      logger.info(URL_ORIGINS.split(',') as string[])

      app.get('/', (_: TRequest, response: TResponse): void => {
        response.send(`Hello World! ${PORT} ${URL_ORIGINS.split(',')}`)
      })

      app.use(validateRequest)

      app.use('/', routers())

      app.listen(PORT, (): void => {
        logger.info(`Server running on port ${PORT}`)
      })
    }
  } catch (error) {
    logger.error('Failed to start server due to database connection error', {
      error
    })
    process.exit(1)
  }
}

startServer()
  .then(() => {
    logger.info('Server started successfully')
  })
  .catch(error => {
    logger.error('Failed to start server', error)
  })
