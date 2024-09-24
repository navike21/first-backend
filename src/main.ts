import express from 'express'
import { connectDataBase } from './connection'
import { app, corsConfig } from './configurations'
import routers from './routers'
import { PORT, validateRequest } from './common'
import { logger } from './logger'

app.use(express.json())

corsConfig()
async function startServer() {
  try {
    const dbConnected = await connectDataBase()
    if (dbConnected) {
      logger.info('Database connected successfully')

      // Ruta base
      app.get('/', (req, res) => {
        res.send(`Hello World! ${PORT}`)
      })

      // Middleware para validar solicitudes
      app.use(validateRequest)

      // Rutas
      app.use('/', routers())

      // Iniciar servidor
      app.listen(PORT, () => {
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
