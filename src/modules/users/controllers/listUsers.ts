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
import { IUser } from '../types'
import { userCollection } from './config'

type FiltersUsers = {
  documentId?: string
  email?: string
  createdAt?: string
  fatherLastName?: string
  motherLastName?: string
  name?: string
}

export const listUsers = async ({ headers, body }: TRequest, response: TResponse) => {
  const { lang } = getInfoHeaders(headers)
  const { meta: { page = 1, limit = 10 } = {}, filters = {} } = body as IRequest

  const {
    success: { list },
    warning: { notMore },
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
  } = filters as FiltersUsers

  const query: Filter<Document> = {
    ...(documentId && { documentId: documentId }),
    ...(email && { email: email }),
    ...(createdAt && { createdAt: { $gte: new Date(createdAt) } }),
    ...(fatherLastName && {
      fatherLastName: { $regex: new RegExp(fatherLastName, 'i') }
    }),
    ...(motherLastName && {
      motherLastName: { $regex: new RegExp(motherLastName, 'i') }
    }),
    ...(name && { name: { $regex: new RegExp(name, 'i') } })
  }

  const dataPromise = collection.find(query).skip(skip).limit(limit).toArray()
  const countPromise = collection.countDocuments(query)

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
            data: dataParsed,
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
