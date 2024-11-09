import { handleErrors } from '../handleErrors'
import { Response } from 'express'

describe('handleErrors', () => {
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  it('should handle error with default status code 500', () => {
    const error = {
      message: 'Internal Server Error',
      statusCode: 500
    }

    handleErrors(error, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      data: undefined,
      meta: undefined
    })
  })

  it('should handle error with provided status code', () => {
    const error = {
      message: 'Not Found',
      statusCode: 404
    }

    handleErrors(error, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Not Found',
      data: undefined,
      meta: undefined
    })
  })

  it('should handle error with data and meta', () => {
    const error = {
      message: 'Bad Request',
      statusCode: 400,
      data: { field: 'email' }
    }

    handleErrors(error, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Bad Request',
      data: { field: 'email' }
    })
  })
})
