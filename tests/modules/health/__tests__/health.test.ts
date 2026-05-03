import request from 'supertest'
import express from 'express'
import { describe, it, expect, vi } from 'vitest'

// Mock mongoose to control DB readyState
vi.mock('mongoose', () => ({ default: { connection: { readyState: 1 } } }))

// Mock responseStructure to avoid i18n and formatting details in tests
vi.mock('@Helpers/responseStructure', () => ({
  successResponse: (res: any, options: any) => {
    res.statusCode = options.statusCode
    return res.status(options.statusCode).json({ status: 'ok', db: 'connected' })
  },
  errorResponse: (res: any, options: any) => {
    res.statusCode = options.statusCode
    return res.status(options.statusCode).json({ error: { code: options.code, details: options.details }, message: options.message, statusCode: options.statusCode, success: false })
  }
}))

describe('Health API', () => {
  it('responds 200 when DB is connected', async () => {
    // Dynamic import to ensure mocks apply
    const { healthApi } = await import('../../../../src/modules/health')
    const app = express()
    healthApi(app as any)
    const resp = await request(app).get('/health')
    expect(resp.status).toBe(200)
    expect(resp.body?.status).toBe('ok')
  })

  it('responds 503 when DB is not connected', async () => {
    vi.resetModules()
    vi.doMock('mongoose', () => ({ default: { connection: { readyState: 0 } } }))
    vi.doMock('@Helpers/responseStructure', () => ({
      successResponse: (res: any, options: any) => {
        res.statusCode = options.statusCode
        return res.status(options.statusCode).json({ status: 'ok', db: 'disconnected' })
      },
      errorResponse: (res: any, options: any) => {
        res.statusCode = options.statusCode
        return res.status(options.statusCode).json({ error: { code: options.code, details: options.details }, message: options.message, statusCode: options.statusCode, success: false })
      }
    }))
    const { healthApi } = await import('../../../../src/modules/health')
    const app = express()
    healthApi(app as any)
    const resp = await request(app).get('/health')
    expect(resp.status).toBe(503)
  })

  it('responds 503 when DB is connecting (readyState = 2)', async () => {
    vi.resetModules()
    vi.doMock('mongoose', () => ({ default: { connection: { readyState: 2 } } }))
    vi.doMock('@Helpers/responseStructure', () => ({
      successResponse: (res: any, options: any) => {
        res.statusCode = options.statusCode
        return res.status(options.statusCode).json({ status: 'ok', db: 'connecting' })
      },
      errorResponse: (res: any, options: any) => {
        res.statusCode = options.statusCode
        return res.status(options.statusCode).json({ error: { code: options.code, details: options.details }, message: options.message, statusCode: options.statusCode, success: false })
      }
    }))
    const { healthApi } = await import('../../../../src/modules/health')
    const app = express()
    healthApi(app as any)
    const resp = await request(app).get('/health')
    expect(resp.status).toBe(503)
  })

  it('responds 503 when DB is disconnected (readyState = 0)', async () => {
    vi.resetModules()
    vi.doMock('mongoose', () => ({ default: { connection: { readyState: 0 } } }))
    vi.doMock('@Helpers/responseStructure', () => ({
      successResponse: (res: any, options: any) => {
        res.statusCode = options.statusCode
        return res.status(options.statusCode).json({ status: 'ok', db: 'disconnected' })
      },
      errorResponse: (res: any, options: any) => {
        res.statusCode = options.statusCode
        return res.status(options.statusCode).json({ error: { code: options.code, details: options.details }, message: options.message, statusCode: options.statusCode, success: false })
      }
    }))
    const { healthApi } = await import('../../../../src/modules/health')
    const app = express()
    healthApi(app as any)
    const resp = await request(app).get('/health')
    expect(resp.status).toBe(503)
  })
})
