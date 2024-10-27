import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: {
    service: 'first-backend'
  },
  transports: [
    new transports.Console()
    // Puedes añadir otros transportes si lo necesitas (archivos, base de datos, etc.)
  ]
})
