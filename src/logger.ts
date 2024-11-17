import { createLogger, format, transports, Logger } from 'winston'

export const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: {
    service: 'first-backend'
  },
  transports: [new transports.Console()]
})
