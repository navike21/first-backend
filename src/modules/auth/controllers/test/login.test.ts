import { login } from '../login'
import {
  TRequest,
  TResponse,
  handleErrors,
  handleSuccess,
  ECollectionState,
  verifyPassword,
  decryptData
} from '../../../../common'
import { getInfoUser } from '../../../users/utils'
import { userAuthMessages } from '../../language'

jest.mock('../../../../common', () => ({
  getInfoHeaders: jest.fn().mockReturnValue({ lang: 'en' }),
  handleErrors: jest.fn(),
  handleSuccess: jest.fn(),
  generateJwtToken: jest.fn().mockResolvedValue('test-token'),
  ECollectionState: {
    ACTIVE: 'ACTIVE',
    DELETED: 'DELETED',
    BLOCKED: 'BLOCKED'
  },
  verifyPassword: jest.fn(),
  decryptData: jest.fn()
}))

jest.mock('../../../users/utils', () => ({
  getInfoUser: jest.fn()
}))

jest.mock('../../language', () => ({
  userAuthMessages: {
    en: {
      login: {
        success: { completed: 'Login successful' },
        warning: {
          notFound: 'User not found',
          isBlocked: 'User is blocked',
          notMatch: 'Password does not match'
        },
        error: { unexpectedError: 'Unexpected error occurred' },
        password: { isMissing: 'Password is missing' }
      }
    },
    es: {
      login: {
        success: { completed: 'Inicio de sesión satisfactorio' },
        warning: {
          notMatch: 'Contraseña incorrecta',
          isBlocked: 'El usuario se encuentra bloqueado',
          notFound: 'El usuario no se encuentra registrado'
        },
        error: { unexpectedError: 'Error inesperado en el inicio de sesión' },
        password: { isMissing: 'La contraseña no se encuentra registrada' }
      }
    }
  }
}))

describe('login', () => {
  let req: Partial<TRequest>
  let res: Partial<TResponse>
  const userAuthMessagesEn = userAuthMessages['en']

  beforeEach(() => {
    req = {
      body: { data: { dataLoginEncrypted: 'encryptedData' } },
      headers: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.clearAllMocks()
  })

  it('should handle user not found', async () => {
    ;(decryptData as jest.Mock).mockReturnValue(
      JSON.stringify({ email: 'test@example.com', password: 'password' })
    )
    ;(getInfoUser as jest.Mock).mockResolvedValue(null)

    await login(req as TRequest, res as TResponse)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessages?.en?.login?.warning?.notFound,
        statusCode: 404
      },
      res
    )
  })

  it('should handle user is blocked', async () => {
    ;(decryptData as jest.Mock).mockReturnValue(
      JSON.stringify({ email: 'test@example.com', password: 'password' })
    )
    ;(getInfoUser as jest.Mock).mockResolvedValue({
      auth: { password: 'hashedPassword' },
      state: ECollectionState.BLOCKED,
      names: 'Test',
      fatherLastName: 'User',
      motherLastName: ''
    })

    await login(req as TRequest, res as TResponse)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessagesEn?.login?.warning?.isBlocked,
        statusCode: 400
      },
      res
    )
  })

  it('should handle missing password in user data', async () => {
    ;(decryptData as jest.Mock).mockReturnValue(
      JSON.stringify({ email: 'test@example.com', password: 'password' })
    )
    ;(getInfoUser as jest.Mock).mockResolvedValue({
      auth: { password: '' },
      state: ECollectionState.ACTIVE,
      names: 'Test',
      fatherLastName: 'User',
      motherLastName: ''
    })

    await login(req as TRequest, res as TResponse)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessagesEn?.login?.password?.isMissing,
        statusCode: 400
      },
      res
    )
  })

  it('should handle password mismatch', async () => {
    ;(decryptData as jest.Mock).mockReturnValue(
      JSON.stringify({ email: 'test@example.com', password: 'password' })
    )
    ;(getInfoUser as jest.Mock).mockResolvedValue({
      auth: { password: 'hashedPassword' },
      state: ECollectionState.ACTIVE,
      names: 'Test',
      fatherLastName: 'User',
      motherLastName: ''
    })
    ;(verifyPassword as jest.Mock).mockReturnValue(false)

    await login(req as TRequest, res as TResponse)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessagesEn?.login?.warning?.notMatch,
        statusCode: 401
      },
      res
    )
  })

  it('should handle successful login', async () => {
    ;(decryptData as jest.Mock).mockReturnValue(
      JSON.stringify({ email: 'test@example.com', password: 'password' })
    )
    ;(getInfoUser as jest.Mock).mockResolvedValue({
      auth: { password: 'hashedPassword' },
      state: ECollectionState.ACTIVE,
      names: 'Test',
      fatherLastName: 'User',
      motherLastName: ''
    })
    ;(verifyPassword as jest.Mock).mockReturnValue(true)

    await login(req as TRequest, res as TResponse)

    expect(handleSuccess).toHaveBeenCalledWith(
      {
        message: userAuthMessagesEn?.login?.success?.completed,
        statusCode: 200,
        data: {
          token: 'test-token',
          email: 'test@example.com',
          names: 'Test',
          fatherLastName: 'User',
          motherLastName: ''
        }
      },
      res
    )
  })

  it('should handle unexpected error', async () => {
    ;(decryptData as jest.Mock).mockReturnValue(
      JSON.stringify({ email: 'test@example.com', password: 'password' })
    )
    ;(getInfoUser as jest.Mock).mockRejectedValue(new Error('Unexpected error'))

    await login(req as TRequest, res as TResponse)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessagesEn?.login?.error?.unexpectedError,
        statusCode: 500,
        data: new Error('Unexpected error')
      },
      res
    )
  })
})
