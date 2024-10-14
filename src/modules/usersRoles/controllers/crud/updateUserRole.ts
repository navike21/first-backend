import { Error as ErrorMongoose } from 'mongoose'
import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../../common'
import { userRoleCrudMessages } from '../../language'
import { UserRoleModel } from '../../models'

export const updateUserRole = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idRole } = params
  const { data } = body as IRequest

  const {
    success: { updated = '' } = {},
    warning: { notUpdated = '' } = {},
    error: { validationFailed = '', unexpectedError = '' } = {}
  } = userRoleCrudMessages[lang]

  if (!idRole) {
    return handleErrors(
      {
        message: validationFailed,
        statusCode: 400
      },
      response
    )
  }

  try {
    const updatedUserRole = await UserRoleModel.findOneAndUpdate(
      { idRole },
      {
        $set: {
          ...data
        },
        $currentDate: { lastModified: true }
      },
      { new: true, lean: true }
    )

    if (!updatedUserRole) {
      return handleErrors(
        {
          message: notUpdated,
          statusCode: 404
        },
        response
      )
    }

    handleSuccess(
      {
        message: updated,
        statusCode: 200,
        data: updatedUserRole
      },
      response
    )
  } catch (error) {
    if (error instanceof ErrorMongoose) {
      return handleErrors(
        {
          message: validationFailed,
          data: error,
          statusCode: 400
        },
        response
      )
    } else {
      return handleErrors(
        {
          message: unexpectedError,
          statusCode: 500
        },
        response
      )
    }
  }
}
