import 'dotenv/config'

export const MONGO_URI = process.env.FIRST_MONGODB_URI ?? ''
export const SECRET_KEY = process.env.FIRST_SECRET_KEY ?? ''
export const PORT = process.env.FIRST_PORT ?? ''
export const URL_ORIGINS = process.env.FIRST_URL_ORIGINS ?? ''
export const JWT_EXPIRES_IN = process.env.FIRST_JWT_EXPIRES_IN ?? ''
export const ENVIRONMENT = process.env.FIRST_ENVIRONMENT ?? ''
