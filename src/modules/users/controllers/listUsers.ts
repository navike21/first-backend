import { WithId } from 'mongodb'
import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { userMessageCrud } from '../language'
import { IUser } from '../types'
import { userCollection } from './config'

export const listUsers = async ({ headers, body }: TRequest, response: TResponse) => {
  const { lang } = getInfoHeaders(headers)
  const { meta: { page = 1, limit = 10 } = {} } = body as IRequest

  const {
    success: { list },
    warning: { notMore },
    error: { unexpectedError }
  } = userMessageCrud[lang]

  const skip = (page - 1) * limit

  const collection = await userCollection

  const dataPromise = collection.find().skip(skip).limit(limit).toArray()
  const countPromise = collection.countDocuments()

  Promise.all([dataPromise, countPromise])
    .then(([data, total]) => {
      const dataStructuredUser = data as WithId<IUser>[]
      const dataParsed = dataStructuredUser.map(
        ({ _id, password, updatedAt, ...rest }) => ({
          ...rest
        })
      )

      const meta = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }

      if (dataParsed.length > 0) {
        handleSuccess(
          {
            message: list,
            details: dataParsed,
            meta,
            statusCode: 200
          },
          response
        )
      } else {
        handleErrors(
          {
            message: notMore,
            statusCode: 404,
            meta
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
