import { Error } from 'mongoose'
import {
  ECollectionState,
  generateId,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TMongoServerError,
  TRequest,
  TResponse
} from '../../../../common'
import { userRoleCrudMessages } from '../../language'
import { UserRoleModel } from '../../models'
import { TUserRoleOmitted } from '../../types'

export const createUserRole = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest

  const { name, role, systemModules } = data as TUserRoleOmitted

  const {
    success: { created = '' } = {},
    error: { creationFailed = '', unexpectedError = '', duplicate = '' } = {}
  } = userRoleCrudMessages[lang]

  try {
    const newUserRole = new UserRoleModel({
      name,
      idRole: generateId(),
      state: ECollectionState.ACTIVE,
      role,
      systemModules
    })

    await newUserRole.save()

    handleSuccess(
      {
        message: created,
        statusCode: 201,
        data
      },
      response
    )
  } catch (error) {
    const { stack, name } = error as Error

    if (name === 'MongoServerError') {
      const { code } = error as TMongoServerError
      const errorMessage = code === 11000 ? duplicate : creationFailed

      return handleErrors(
        {
          message: errorMessage,
          statusCode: 500,
          data: error
        },
        response
      )
    }

    return handleErrors(
      {
        message: unexpectedError,
        statusCode: 500,
        data: stack
      },
      response
    )
  }
}
