import 'dotenv/config'

export const MONGO_URI = process.env.FIRST_MONGODB_URI as string
export const SECRET_KEY = process.env.FIRST_SECRET_KEY as string
export const PORT = process.env.FIRST_PORT as string
export const URL_ORIGINS = process.env.FIRST_URL_ORIGINS as string
export const JWT_EXPIRES_IN = process.env.FIRST_JWT_EXPIRES_IN as string
export const ENVIRONMENT = process.env.FIRST_ENVIRONMENT as string
export const ENCRYPTION_KEY = process.env.FIRST_ENCRYPTION_KEY as string
export const ENCRYPTION_IV = process.env.FIRST_ENCRYPTION_IV as string
