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
import { Error } from 'mongoose'

export const createUser = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest

  const {
    success: { created = '' } = {},
    error: { creationFailed = '', unexpectedError = '', duplicate = '' } = {}
  } = userCrudMessages[lang]

  try {
    const newUser = new UserModel({
      ...defaultUserData,
      ...data
    })

    await newUser.save()

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
      if (code === 11000) {
        handleErrors(
          {
            message: duplicate,
            statusCode: 500,
            data: error
          },
          response
        )
      } else {
        handleErrors(
          {
            message: creationFailed,
            statusCode: 500,
            data: error
          },
          response
        )
      }
    } else {
      handleErrors(
        {
          message: unexpectedError,
          statusCode: 500,
          data: stack
        },
        response
      )
    }
  }
}
