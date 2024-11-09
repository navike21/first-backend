import request from 'supertest'
import { app } from '../app'
import { corsConfig } from '../cors'
import { URL_ORIGINS } from '../../common'

describe('CORS Configuration', () => {
  beforeAll(() => {
    corsConfig()
  })

  it('should allow requests from allowed origins', async () => {
    const allowedOrigins = `${URL_ORIGINS}`.split(',')

    for (const origin of allowedOrigins) {
      const response = await request(app).get('/').set('Origin', origin)

      expect(response.headers['access-control-allow-origin']).toBe(origin)
    }
  })

  it('should not allow requests from disallowed origins', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://disallowed-origin.com')

    expect(response.headers['access-control-allow-origin']).toBeUndefined()
  })

  it('should handle preflight requests', async () => {
    const allowedOrigins = `${URL_ORIGINS}`.split(',')

    for (const origin of allowedOrigins) {
      const response = await request(app)
        .options('/')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'GET')

      expect(response.headers['access-control-allow-origin']).toBe(origin)
      expect(response.headers['access-control-allow-methods']).toContain('GET')
    }
  })
})
