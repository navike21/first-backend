import { TResponse } from '../../types'
import { handleErrors } from '../handleErrors'

describe('handleErrors', () => {
  let mockResponse: Partial<TResponse>

  const error = {
    message: 'An error occurred',
    data: undefined,
    meta: undefined
  }

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  const runErrorTest = (statusCode: number) => {
    handleErrors(
      {
        ...error,
        statusCode
      },
      mockResponse as TResponse
    )

    expect(mockResponse.status).toHaveBeenCalledWith(statusCode)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: error.message,
      data: error.data,
      meta: error.meta
    })
  }

  it('should respond with a 500 status code by default', () => {
    runErrorTest(500)
  })

  it('should respond with the provided status code', () => {
    runErrorTest(404)
  })
})
