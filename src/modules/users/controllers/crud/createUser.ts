import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../../common'
import { userCollection } from '../config'
import { userCrudMessages } from '../../language'
import { MongoServerError } from 'mongodb'
import { defaultUserData } from '../../constants'

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
    await (
      await userCollection
    ).insertOne({
      ...defaultUserData,
      ...data
    })

    handleSuccess(
      {
        message: created,
        statusCode: 201,
        data
      },
      response
    )
  } catch (error) {
    if (error instanceof MongoServerError) {
      const { code, errorResponse } = error

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
