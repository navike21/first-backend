import express from 'express'
import { app } from '../app'

describe('Express app instance', () => {
  it('should be an instance of an Express application', () => {
    expect(app).toBeInstanceOf(express.application.constructor)
  })

  it('should have a listen function', () => {
    expect(typeof app.listen).toBe('function')
  })
})
