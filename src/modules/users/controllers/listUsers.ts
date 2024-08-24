import { Document, Filter, WithId } from 'mongodb'
import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { userMessageCrud } from '../language'
import { IUser, TFiltersUsers } from '../types'
import { userCollection } from './config'

export const listUsers = async ({ headers, body }: TRequest, response: TResponse) => {
  const { lang } = getInfoHeaders(headers)
  const { meta: { page = 1, limit = 10 } = {}, filters = {} } = body as IRequest

  const {
    success: { list },
    warning: { notMore, isEmpty },
    error: { unexpectedError }
  } = userMessageCrud[lang]

  const skip = (page - 1) * limit

  const collection = await userCollection

  const {
    documentId = '',
    email = '',
    createdAt = '',
    fatherLastName = '',
    motherLastName = '',
    name = ''
  } = filters as TFiltersUsers

  const query: Filter<Document> =
    Object.keys(filters).length > 0
      ? {
          ...(documentId && { documentId: documentId }),
          ...(email && { email: email }),
          ...(createdAt && { createdAt: { $gte: new Date(createdAt) } }),
          ...(fatherLastName && {
            fatherLastName: { $regex: new RegExp(fatherLastName, 'i') }
          }),
          ...(motherLastName && {
            motherLastName: { $regex: new RegExp(motherLastName, 'i') }
          }),
          ...(name && { names: { $regex: new RegExp(name, 'i') } })
        }
      : {}

  try {
    const [data, total] = await Promise.all([
      collection.find(query).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ])

    const dataStructuredUser = data as WithId<IUser>[]
    const dataParsed = dataStructuredUser.map(({ _id, updatedAt, config, ...rest }) => ({
      ...rest
    }))

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
          data: dataParsed,
          meta,
          statusCode: 200
        },
        response
      )
    }
    if (dataParsed.length === 0 && page > 1) {
      handleErrors(
        {
          message: notMore,
          statusCode: 404,
          meta
        },
        response
      )
    }
    if (meta.totalPages === 0) {
      handleErrors(
        {
          message: isEmpty,
          statusCode: 404,
          meta
        },
        response
      )
    }
  } catch (error) {
    handleErrors(
      {
        message: unexpectedError,
        statusCode: 500
      },
      response
    )
  }
}
