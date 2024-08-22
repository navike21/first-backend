import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { userCollection } from './config'
import { userMessageCrud } from '../language'
import { MongoServerError } from 'mongodb'
import { defaultUserData } from '../constants'

export const createUser = async ({ body, headers }: TRequest, response: TResponse) => {
  const { lang } = getInfoHeaders(headers)

  const {
    success: { created },
    error: { creationFailed, unexpectedError, duplicate }
  } = userMessageCrud[lang]

  const { data } = body as IRequest

  await (
    await userCollection
  )
    .insertOne({
      ...defaultUserData,
      ...data
    })
    .then(() => {
      handleSuccess(
        {
          message: created,
          statusCode: 201
        },
        response
      )
    })
    .catch(error => {
      const { code, errorResponse } = error as MongoServerError

      if (code === 11000) {
        handleErrors(
          {
            message: duplicate,
            statusCode: 400,
            data: errorResponse
          },
          response
        )
      } else {
        handleErrors(
          {
            message: creationFailed,
            statusCode: 500
          },
          response
        )
      }
    })
    .catch(() => {
      handleErrors(
        {
          message: unexpectedError,
          statusCode: 500
        },
        response
      )
    })
}
