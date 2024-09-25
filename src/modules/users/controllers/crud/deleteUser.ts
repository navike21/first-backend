import { Error as MongooseError } from 'mongoose'
import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../../common'
import { userCrudMessages } from '../../language'
import { UserModel } from '../../models'

export const deleteUser = async (
  { headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUser } = params
  const {
    success: { deleted = '' } = {},
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
    const result = await UserModel.updateMany(
      { publicId: idUser },
      {
        $set: {
          state: ECollectionState.DELETED
        },
        $currentDate: {
          lastModified: true
        }
      }
    )

    if (result.matchedCount === 0) {
      return handleErrors(
        {
          message: notUpdated,
          statusCode: 400
        },
        response
      )
    }

    handleSuccess(
      {
        message: deleted,
        statusCode: 200
      },
      response
    )
  } catch (error) {
    if (error instanceof MongooseError) {
      handleErrors(
        {
          message: unexpectedError,
          data: error,
          statusCode: 500
        },
        response
      )
    } else {
      handleErrors(
        {
          message: unexpectedError,
          statusCode: 500
        },
        response
      )
    }
  }
}
