import { FilterQuery, SortOrder } from 'mongoose'
import {
  handleErrors,
  handleSuccess,
  getInfoHeaders,
  TRequest,
  TResponse,
  IRequest,
  ECollectionState
} from '../../../common'
import { fileMessages } from '../language'
import { IFile, TFiltersFiles } from '../types'
import { FileModel } from '../models'
import { logger } from '../../../logger'

export const listAllFiles = async (
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
    files: {
      success: { list } = {},
      warning: { notMore, notFound } = {},
      error: { unexpectedError } = {}
    }
  } = fileMessages[lang]

  const { mimeType } = filters as TFiltersFiles

  const query: FilterQuery<IFile> = {
    state: ECollectionState.ACTIVE,
    ...(mimeType && { mimeType })
  }

  try {
    const [data, total] = await Promise.all([
      FileModel.find(query)
        .sort(sort as Record<string, SortOrder>)
        .skip(skip)
        .limit(limit)
        .lean(),
      FileModel.countDocuments(query)
    ])

    const dataParsed = data.map(
      ({ idFile, mimeType, originalName, path, thumbnails }) => ({
        idFile,
        mimeType,
        originalName,
        path,
        thumbnails
      })
    )

    const meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }

    if (dataParsed.length) {
      handleSuccess(
        {
          message: `${list}`,
          data: dataParsed,
          meta,
          statusCode: 200
        },
        response
      )
    } else {
      handleErrors(
        {
          message: page > 1 ? `${notMore}` : `${notFound}`,
          statusCode: 404,
          meta
        },
        response
      )
    }
  } catch (error) {
    logger.error(error)
    handleErrors({ message: `${unexpectedError}`, statusCode: 500 }, response)
  }
}
