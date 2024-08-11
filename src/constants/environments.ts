import 'dotenv/config'

export const MONGO_URI = process.env.NEST_MONGODB_URI ?? ''
export const SECRET_KEY = process.env.NEST_SECRET_KEY ?? ''
export const PORT = process.env.NEST_PORT ?? ''
export const URL_ORIGINS = process.env.NEST_URL_ORIGINS ?? ''
export const JWT_EXPIRES_IN = process.env.NEST_JWT_EXPIRES_IN ?? ''
