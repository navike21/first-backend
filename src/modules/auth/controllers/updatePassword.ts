import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { UserModel } from '../../users/models'
import { IUserAuth } from '../../users/types'
import { userAuthMessages } from '../language'

export const updatePassword = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUser } = params
  const { data } = body as IRequest

  const {
    password: {
      success: { updated: passwordUpdated = '' } = {},
      error: {
        updateFailed: updateFailedPassword = '',
        unexpectedError: unexpectedErrorPassword = ''
      } = {},
      warning: {
        notUpdated: notUpdatedPassword = '',
        notMatch: notMatchPassword = ''
      } = {}
    }
  } = userAuthMessages[lang]

  try {
    const { confirmPassword = '', password = '' } = data as IUserAuth

    if (password !== confirmPassword) {
      return handleErrors(
        { message: notMatchPassword, statusCode: 400 },
        response
      )
    }

    const updatedPassWordUser = await UserModel.findOneAndUpdate(
      { publicId: idUser },
      {
        $set: { 'auth.password': password }
      },
      { new: true, lean: true }
    )

    if (!updatedPassWordUser) {
      return handleErrors(
        { message: notUpdatedPassword, statusCode: 404 },
        response
      )
    }

    handleSuccess(
      { message: passwordUpdated, statusCode: 200, data: updatedPassWordUser },
      response
    )
  } catch (error) {
    const isValidationError = error instanceof Error
    handleErrors(
      {
        message: isValidationError
          ? updateFailedPassword
          : unexpectedErrorPassword,
        data: isValidationError ? error : undefined,
        statusCode: isValidationError ? 400 : 500
      },
      response
    )
  }
}
