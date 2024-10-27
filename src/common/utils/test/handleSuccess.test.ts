import { handleSuccess } from '../handleSuccess'
import { ICustomRequest, IMeta, TResponse } from '../../types'
import { EOperationStatus } from '../../enums'

describe('handleSuccess', () => {
  let mockResponse: Partial<TResponse>

  const successResponse: ICustomRequest = {
    message: EOperationStatus.SUCCESS,
    statusCode: 200,
    data: undefined,
    meta: undefined
  }

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  const runSuccessTest = (statusCode: number) => {
    handleSuccess(
      {
        ...successResponse,
        statusCode
      },
      mockResponse as TResponse
    )

    expect(mockResponse.status).toHaveBeenCalledWith(statusCode)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: successResponse.message,
      data: successResponse.data,
      meta: successResponse.meta
    })
  }

  it('should respond with a 200 status code by default', () => {
    runSuccessTest(200)
  })

  it('should respond with the provided status code', () => {
    runSuccessTest(201)
  })

  it('should respond with a 200 status code and the provided data', () => {
    const data = { foo: 'bar' }

    handleSuccess(
      {
        ...successResponse,
        statusCode: 200,
        data
      },
      mockResponse as TResponse
    )

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: successResponse.message,
      data,
      meta: successResponse.meta
    })
  })

  it('should respond with a 200 status code and the provided meta', () => {
    const meta: IMeta = {
      limit: 10,
      page: 1,
      total: 100,
      totalPages: 10
    }

    handleSuccess(
      {
        ...successResponse,
        statusCode: 200,
        meta
      },
      mockResponse as TResponse
    )

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: successResponse.message,
      data: successResponse.data,
      meta
    })
  })
})
