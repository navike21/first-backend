import { MongoServerError } from 'mongodb'
import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../../common'
import { userCrudMessage } from '../../language'
import { userCollection } from '../config'

export const deleteUser = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUser } = params
  const {
    success: { deleted },
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
    const result = await (
      await userCollection
    ).updateMany(
      { public_id: idUser },
      {
        $set: {
          state: ECollectionState.DELETED
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
        message: deleted,
        statusCode: 200
      },
      response
    )
  } catch (error) {
    if (error instanceof MongoServerError) {
      const { code, errorResponse } = error

      if (Object.keys(errorResponse).length > 0) {
        handleErrors(
          {
            message: notUpdated,
            data: { code },
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
