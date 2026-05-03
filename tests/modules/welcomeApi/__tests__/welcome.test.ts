import request from 'supertest'
import express from 'express'
import { describe, it, expect, vi } from 'vitest'

// Mock responseStructure to isolate route behavior
vi.mock('@Helpers/responseStructure', () => ({
  successResponse: (res: any, options: any) => {
    res.statusCode = options.statusCode ?? 200
    return res.status(res.statusCode).json({ message: options.message, data: options.data })
  },
  errorResponse: (res: any, options: any) => {
    res.statusCode = options.statusCode
    return res.status(options.statusCode).json({ error: { code: options.code, details: options.details }, message: options.message, statusCode: options.statusCode, success: false })
  }
}))

import { welcomeApi } from '@Modules/welcomeApi'

describe('Welcome API', () => {
  it('GET / should respond with welcome message', async () => {
    const app = express()
    welcomeApi(app)
    const resp = await request(app).get('/')
    expect(resp.status).toBe(200)
  })
})
