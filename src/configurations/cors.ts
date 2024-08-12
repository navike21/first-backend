import cors from 'cors'
import { app } from './app'
import { URL_ORIGINS } from '../common'

export function corsConfig(): void {
  app.use(
    cors({
      origin: URL_ORIGINS.split(',')
    })
  )
}
