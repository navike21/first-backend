import 'dotenv/config'

process.env.FIRST_MONGODB_URI = 'mongodb://localhost:27017/testDB'
process.env.FIRST_SECRET_KEY = 'test_secret_key'
process.env.FIRST_PORT = '3000'
process.env.FIRST_URL_ORIGINS = 'http://localhost:3000'
process.env.FIRST_JWT_EXPIRES_IN = '1d'
process.env.FIRST_ENVIRONMENT = 'test'

import {
  MONGO_URI,
  SECRET_KEY,
  PORT,
  URL_ORIGINS,
  JWT_EXPIRES_IN,
  ENVIRONMENT
} from '../environments'

describe('Environment Variables', () => {
  it('MONGO_URI should be equal to process.env.FIRST_MONGODB_URI', () => {
    expect(MONGO_URI).toBe('mongodb://localhost:27017/testDB')
  })

  it('SECRET_KEY should be equal to process.env.FIRST_SECRET_KEY', () => {
    expect(SECRET_KEY).toBe('test_secret_key')
  })

  it('PORT should be equal to process.env.FIRST_PORT', () => {
    expect(PORT).toBe('3000')
  })

  it('URL_ORIGINS should be equal to process.env.FIRST_URL_ORIGINS', () => {
    expect(URL_ORIGINS).toBe('http://localhost:3000')
  })

  it('JWT_EXPIRES_IN should be equal to process.env.FIRST_JWT_EXPIRES_IN', () => {
    expect(JWT_EXPIRES_IN).toBe('1d')
  })

  it('ENVIRONMENT should be equal to process.env.FIRST_ENVIRONMENT', () => {
    expect(ENVIRONMENT).toBe('test')
  })
})
