import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TMongoServerError,
  TRequest,
  TResponse
} from '../../../../common'
import { userCrudMessages } from '../../language'
import { defaultUserData } from '../../constants'
import { UserModel } from '../../models'
import { MongoServerError } from 'mongodb'

export const createUser = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest
  const {
    success: { created } = {},
    error: { creationFailed, unexpectedError, duplicate } = {}
  } = userCrudMessages[lang]

  try {
    const newUser = new UserModel({ ...defaultUserData, ...data })
    await newUser.save()

    return handleSuccess(
      { message: `${created}`, statusCode: 201, data },
      response
    )
  } catch (error) {
    const isDuplicateError =
      error instanceof MongoServerError &&
      (error as unknown as TMongoServerError).code === 11000
    const errorMessage = isDuplicateError ? duplicate : creationFailed

    handleErrors(
      {
        message: `${isDuplicateError ? errorMessage : unexpectedError}`,
        statusCode: 500,
        data: error
      },
      response
    )
  }
}
