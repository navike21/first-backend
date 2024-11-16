import { verifySession } from '../verifySession'
import { TRequest, TResponse, TNext, verifyJwtToken } from '../../../../common'
import { userAuthMessages } from '../../language'

jest.mock('../../../../common', () => ({
  ...jest.requireActual('../../../../common'),
  verifyJwtToken: jest.fn()
}))

const mockResponse = () => {
  const res: Partial<TResponse> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as TResponse
}

const mockNext: TNext = jest.fn()

describe('verifySession Middleware', () => {
  let req: Partial<TRequest>
  let res: TResponse

  beforeEach(() => {
    req = {
      headers: {}
    }
    res = mockResponse()
    jest.clearAllMocks()
  })

  it('should return 400 if authorization header is missing', async () => {
    req.headers = {}

    await verifySession(req as TRequest, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: userAuthMessages?.en?.session?.token?.isMissing,
      statusCode: undefined,
      data: undefined,
      meta: undefined
    })
  })

  it('should return 401 if jwt token is missing', async () => {
    req.headers = {
      authorization: 'Bearer '
    }

    await verifySession(req as TRequest, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: userAuthMessages?.en?.session?.token?.isMatch,
      data: undefined,
      meta: undefined
    })
  })

  it('should return 401 if jwt token is invalid', async () => {
    req.headers = {
      authorization: 'Bearer invalidtoken'
    }
    ;(verifyJwtToken as jest.Mock).mockReturnValue(false)

    await verifySession(req as TRequest, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: userAuthMessages?.en?.session?.validation?.warning?.notMatch,
      data: undefined,
      meta: undefined
    })
  })

  it('should call next if jwt token is valid', async () => {
    req.headers = {
      authorization: 'Bearer validtoken'
    }
    ;(verifyJwtToken as jest.Mock).mockReturnValue(true)

    await verifySession(req as TRequest, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  it('should return 401 if jwt token is expired', async () => {
    req.headers = {
      authorization: 'Bearer expiredtoken'
    }
    ;(verifyJwtToken as jest.Mock).mockImplementation(() => {
      const error = new Error('TokenExpiredError')
      error.name = 'TokenExpiredError'
      throw error
    })

    await verifySession(req as TRequest, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: userAuthMessages?.en?.session?.validation?.warning?.isExpired,
      data: undefined,
      meta: undefined
    })
  })

  it('should return 500 for unexpected errors', async () => {
    req.headers = {
      authorization: 'Bearer sometoken'
    }
    ;(verifyJwtToken as jest.Mock).mockImplementation(() => {
      throw new Error('UnexpectedError')
    })

    await verifySession(req as TRequest, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message:
        userAuthMessages?.en?.session?.validation?.error?.unexpectedError,
      data: undefined,
      meta: undefined
    })
  })
})
