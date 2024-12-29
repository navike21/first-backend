import cors from 'cors'
import { app } from './app'
import { URL_ORIGINS } from '../common'

export function corsConfig(): void {
  const allowedOrigins = URL_ORIGINS.split(',')

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true) // Permite el acceso
        } else {
          callback(new Error('Not allowed by CORS')) // Bloquea el acceso
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )
}
