import cors from 'cors'
import { URL_ORIGINS } from '../constants'
import { app } from './app'

export function corsConfig(): void {
  app.use(
    cors({
      origin: URL_ORIGINS.split(',')
    })
  )
}
