import { updatePassword } from '../updatePassword'
import { handleErrors, handleSuccess } from '../../../../common'
import { UserModel } from '../../../users/models'
import { userAuthMessages } from '../../language'
import { TRequest, TResponse } from '../../../../common/types'

jest.mock('../../../../common', () => ({
  handleErrors: jest.fn(),
  handleSuccess: jest.fn(),
  encryptPassword: jest.fn().mockReturnValue('hashed-password'),
  getInfoHeaders: jest.fn().mockReturnValue({ lang: 'en' })
}))

jest.mock('../../../users/models', () => ({
  UserModel: {
    findOneAndUpdate: jest.fn()
  }
}))

jest.mock('../../language', () => ({
  userAuthMessages: {
    en: {
      password: {
        success: { updated: 'Password updated successfully' },
        error: {
          updateFailed: 'Password update failed',
          unexpectedError: 'Unexpected error occurred'
        },
        warning: {
          notUpdated: 'Password not updated',
          notMatch: 'Passwords do not match'
        }
      }
    }
  }
}))

describe('updatePassword', () => {
  let req: TRequest
  let res: TResponse

  beforeEach(() => {
    req = {
      body: {
        data: { password: 'newPassword123', confirmPassword: 'newPassword123' }
      },
      headers: { lang: 'en' },
      params: { idUser: 'user-123' }
    } as unknown as TRequest
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as TResponse

    jest.clearAllMocks()
  })

  it('should return an error if passwords do not match', async () => {
    req.body.data.confirmPassword = 'differentPassword'

    await updatePassword(req, res)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessages?.en?.password?.warning?.notMatch,
        statusCode: 400
      },
      res
    )
  })

  it('should update the password if passwords match', async () => {
    ;(UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
      publicId: 'user-123',
      auth: { password: 'hashed-password' }
    })

    await updatePassword(req, res)

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { publicId: 'user-123' },
      { $set: { 'auth.password': 'hashed-password' } },
      { new: true, lean: true, projection: { _id: 0, auth: 0 } }
    )

    expect(handleSuccess).toHaveBeenCalledWith(
      {
        message: userAuthMessages?.en?.password?.success?.updated,
        statusCode: 200,
        data: { publicId: 'user-123', auth: { password: 'hashed-password' } }
      },
      res
    )
  })

  it('should return an error if user is not found', async () => {
    ;(UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null)

    await updatePassword(req, res)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessages?.en?.password?.warning?.notUpdated,
        statusCode: 404
      },
      res
    )
  })

  it('should handle update Failed', async () => {
    const error = new Error('Validation failed')
    ;(UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(error)

    await updatePassword(req, res)

    expect(handleErrors).toHaveBeenCalledWith(
      {
        message: userAuthMessages?.en?.password?.error?.updateFailed,
        statusCode: 400,
        data: error
      },
      res
    )
  })
})
