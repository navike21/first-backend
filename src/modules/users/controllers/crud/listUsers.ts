import { FilterQuery, SortOrder } from 'mongoose'
import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../../common'
import { userCrudMessages } from '../../language'
import { IUser, TFiltersUsers } from '../../types'
import { UserModel } from '../../models'
import { logger } from '../../../../logger'

export const listUsers = async (
  { headers, body }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const {
    meta: { page = 1, limit = 10 } = {},
    filters = {},
    sort = {}
  } = body as IRequest

  const skip = (page - 1) * limit

  const {
    success: { list = '' } = {},
    warning: { notMore = '', isEmpty = '' } = {},
    error: { unexpectedError = '' } = {}
  } = userCrudMessages[lang]

  const {
    documentId = '',
    email = '',
    createdAt = '',
    fatherLastName = '',
    motherLastName = '',
    names = ''
  } = filters as TFiltersUsers

  const query: FilterQuery<IUser> =
    Object.keys(filters).length > 0
      ? {
          ...(documentId && { documentId }),
          ...(email && { email }),
          ...(createdAt && { createdAt: { $gte: new Date(createdAt) } }),
          ...(fatherLastName && {
            fatherLastName: { $regex: new RegExp(fatherLastName, 'i') }
          }),
          ...(motherLastName && {
            motherLastName: { $regex: new RegExp(motherLastName, 'i') }
          }),
          ...(names && { names: { $regex: new RegExp(names, 'i') } }),
          state: ECollectionState.ACTIVE
        }
      : { state: ECollectionState.ACTIVE }

  try {
    const [data, total] = await Promise.all([
      UserModel.find(query)
        .sort(sort as string | { [key: string]: SortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query)
    ])

    const dataParsed = data.map(
      ({
        dateOfBirth,
        documentId,
        email,
        fatherLastName,
        image,
        motherLastName,
        names,
        phone,
        publicId,
        state
      }) => ({
        dateOfBirth,
        documentId,
        email,
        fatherLastName,
        image,
        motherLastName,
        names,
        phone,
        publicId,
        state
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
    } else if (page > 1) {
      handleErrors(
        {
          message: notMore,
          statusCode: 404,
          meta
        },
        response
      )
    } else {
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
    logger.error(error)
    handleErrors(
      {
        message: unexpectedError,
        statusCode: 500
      },
      response
    )
  }
}
