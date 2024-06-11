import 'dotenv/config'

export const MONGO_URI = process.env.MONGODB_URI ?? ''
export const SECRET_KEY = process.env.SECRET_KEY ?? ''
export const PORT = process.env.PORT ?? ''
export const URL_ORIGINS = process.env.URL_ORIGINS ?? ''
