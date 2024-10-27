import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  TNext,
  TRequest,
  TResponse
} from '../../../common'
import { userRoleCrudMessages } from '../language'
import { UserRoleModel } from '../models'

export const checkUserRoleExists = async (
  { params, headers }: TRequest,
  response: TResponse,
  next: TNext
) => {
  const { idRole } = params
  const { lang } = getInfoHeaders(headers)
  const { warning: { notFound = '' } = {} } = userRoleCrudMessages[lang]

  try {
    const existingUserRole = await UserRoleModel.findOne({ idRole }).lean()
    if (
      !existingUserRole ||
      existingUserRole.state === ECollectionState.DELETED
    ) {
      return handleErrors(
        {
          message: notFound,
          statusCode: 404
        },
        response
      )
    }

    next()
  } catch (error) {
    handleErrors(
      {
        message: notFound,
        statusCode: 500,
        data: error
      },
      response
    )
  }
}
