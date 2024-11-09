import { handleSuccess } from '../handleSuccess'
import { ICustomRequest, TResponse } from '../../types'

describe('handleSuccess', () => {
  let mockResponse: Partial<TResponse>
  let mockSuccess: ICustomRequest

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    mockSuccess = {
      message: 'Operation successful',
      statusCode: 201,
      data: { detail: 'Success details' },
      meta: { page: 1, limit: 10 }
    }
  })

  it('should send the correct response with statusCode, message, data, and meta', () => {
    handleSuccess(mockSuccess, mockResponse as TResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'Operation successful',
      data: { detail: 'Success details' },
      meta: { page: 1, limit: 10 }
    })
  })

  it('should default statusCode to 200 if not provided', () => {
    const successWithoutStatusCode: ICustomRequest = {
      message: 'Default success',
      data: { detail: 'Success details' },
      meta: { page: 2, limit: 5 },
      statusCode: 200
    }

    handleSuccess(successWithoutStatusCode, mockResponse as TResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'Default success',
      data: { detail: 'Success details' },
      meta: { page: 2, limit: 5 }
    })
  })

  it('should call response.status and response.send exactly once', () => {
    handleSuccess(mockSuccess, mockResponse as TResponse)

    expect(mockResponse.status).toHaveBeenCalledTimes(1)
    expect(mockResponse.send).toHaveBeenCalledTimes(1)
  })
})
