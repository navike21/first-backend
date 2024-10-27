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
import { MongoServerError } from 'mongodb'

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

    return handleSuccess({ message: created, statusCode: 201, data }, response)
  } catch (error) {
    const isDuplicateError =
      error instanceof MongoServerError &&
      (error as unknown as TMongoServerError).code === 11000
    const errorMessage = isDuplicateError ? duplicate : creationFailed

    handleErrors(
      {
        message: isDuplicateError ? errorMessage : unexpectedError,
        statusCode: 500,
        data: error
      },
      response
    )
  }
}
