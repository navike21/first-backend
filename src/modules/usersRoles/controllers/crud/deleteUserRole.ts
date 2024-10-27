import { Error as MongooseError } from 'mongoose'
import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../../common'
import { userRoleCrudMessages } from '../../language'
import { UserRoleModel } from '../../models'

export const deleteUserRole = async (
  { headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idRole } = params

  const {
    success: { deleted = '' } = {},
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
    await UserRoleModel.updateOne(
      { idRole },
      {
        $set: { state: ECollectionState.DELETED },
        $currentDate: { lastModified: true }
      }
    )

    handleSuccess(
      {
        message: deleted,
        statusCode: 200
      },
      response
    )
  } catch (error) {
    handleErrors(
      {
        message:
          error instanceof MongooseError ? validationFailed : unexpectedError,
        data: error,
        statusCode: error instanceof MongooseError ? 400 : 500
      },
      response
    )
  }
}
