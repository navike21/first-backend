import { Error as ErrorMongoose } from 'mongoose'
import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../../common'
import { userCrudMessages } from '../../language'
import { UserModel } from '../../models'

export const updateUser = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUser } = params
  const { data } = body as IRequest

  const {
    success: { updated = '' } = {},
    warning: { notUpdated = '' } = {},
    error: { validationFailed = '', unexpectedError = '' } = {}
  } = userCrudMessages[lang]

  if (!idUser) {
    return handleErrors(
      {
        message: validationFailed,
        statusCode: 400
      },
      response
    )
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { publicId: idUser },
      {
        $set: {
          ...data
        },
        $currentDate: { lastModified: true }
      },
      { new: true, lean: true }
    )

    if (!updatedUser) {
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
        data: updatedUser
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
