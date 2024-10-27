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
import { userRoleCrudMessages } from '../../language'
import { IUserRole, TFiltersUserRoles } from '../../types'
import { UserRoleModel } from '../../models'
import { logger } from '../../../../logger'

export const listUserRoles = async (
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
  } = userRoleCrudMessages[lang]

  const { name = '', role = '' } = filters as TFiltersUserRoles

  const query: FilterQuery<IUserRole> = {
    state: ECollectionState.ACTIVE,
    ...(name && { [`name.${lang}`]: { $regex: new RegExp(name, 'i') } }),
    ...(role && { role: { $in: role } })
  }

  try {
    const [data, total] = await Promise.all([
      UserRoleModel.find(query)
        .sort(sort as Record<string, SortOrder>)
        .skip(skip)
        .limit(limit)
        .lean(),
      UserRoleModel.countDocuments(query)
    ])

    const dataParsed = data.map(
      ({ name, idRole, role, systemModules, state }) => ({
        name: name[lang] || '',
        idRole,
        role,
        systemModules,
        state
      })
    )

    const meta = {
      page,
      limit,
      total,
      totalPages: total > 0 ? Math.ceil(total / limit) : 1
    }

    if (dataParsed.length > 0) {
      handleSuccess(
        { message: list, data: dataParsed, meta, statusCode: 200 },
        response
      )
    } else {
      handleErrors(
        { message: page > 1 ? notMore : isEmpty, statusCode: 404, meta },
        response
      )
    }
  } catch (error) {
    logger.error(error)
    handleErrors({ message: unexpectedError, statusCode: 500 }, response)
  }
}
