import { validateRequest } from '../validateRequest'
import { RequestSchema } from '../../schemas'
import { getInfoHeaders, handleErrors } from '../../utils'
import { TNext, TRequest, TResponse } from '../../types'

jest.mock('../../schemas')
jest.mock('../../utils')

describe('validateRequest middleware', () => {
  let mockRequest: Partial<TRequest>
  let mockResponse: Partial<TResponse>
  let mockNext: TNext

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
      method: 'POST'
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockNext = jest.fn()
    ;(getInfoHeaders as jest.Mock).mockReturnValue({
      lang: 'en',
      filesContent: false
    })
  })

  it('should call next if method is GET', async () => {
    mockRequest.method = 'GET'
    await validateRequest(
      mockRequest as TRequest,
      mockResponse as TResponse,
      mockNext
    )
    expect(mockNext).toHaveBeenCalled()
  })

  it('should call next if method is DELETE and body is empty', async () => {
    mockRequest.method = 'DELETE'
    await validateRequest(
      mockRequest as TRequest,
      mockResponse as TResponse,
      mockNext
    )
    expect(mockNext).toHaveBeenCalled()
  })

  it('should call next if filesContent is true', async () => {
    ;(getInfoHeaders as jest.Mock).mockReturnValue({
      lang: 'en',
      filesContent: true
    })
    await validateRequest(
      mockRequest as TRequest,
      mockResponse as TResponse,
      mockNext
    )
    expect(mockNext).toHaveBeenCalled()
  })

  it('should validate request body and call next if validation passes', async () => {
    ;(RequestSchema as jest.Mock).mockReturnValue({
      validateAsync: jest.fn().mockResolvedValue(true)
    })
    await validateRequest(
      mockRequest as TRequest,
      mockResponse as TResponse,
      mockNext
    )
    expect(RequestSchema).toHaveBeenCalledWith('en')
    expect(mockNext).toHaveBeenCalled()
  })

  it('should handle validation errors', async () => {
    const validationError = {
      details: [{ message: 'Validation error' }],
      message: 'Validation error'
    }
    ;(RequestSchema as jest.Mock).mockReturnValue({
      validateAsync: jest.fn().mockRejectedValue(validationError)
    })
    await validateRequest(
      mockRequest as TRequest,
      mockResponse as TResponse,
      mockNext
    )
    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: 'Validation error',
        statusCode: 400,
        data: validationError.details
      },
      mockResponse
    )
  })
})
