import { MongoServerError } from 'mongodb'
import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../../common'
import { defaultUserData } from '../../constants'
import { userCrudMessage } from '../../language'
import { userCollection } from '../config'

export const updateUser = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUser } = params
  const { data } = body as IRequest

  const {
    success: { updated },
    warning: { notUpdated },
    error: { validationFailed, unexpectedError }
  } = userCrudMessage[lang]

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
    const currentData = await (await userCollection).findOne({ public_id: idUser })
    delete currentData?.lastModified

    const result = await (
      await userCollection
    ).updateMany(
      { public_id: idUser },
      {
        $set: {
          ...defaultUserData,
          ...currentData,
          ...data,
          public_id: idUser
        },
        $currentDate: { lastModified: true }
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
        message: updated,
        statusCode: 200,
        data: { ...data, public_id: idUser }
      },
      response
    )
  } catch (error) {
    if (error instanceof MongoServerError) {
      const { errorResponse } = error

      if (Object.keys(errorResponse).length > 0) {
        handleErrors(
          {
            message: notUpdated,
            data: { errorResponse },
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
