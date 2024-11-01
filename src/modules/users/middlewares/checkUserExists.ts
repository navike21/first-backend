import {
  getInfoHeaders,
  handleErrors,
  TNext,
  TRequest,
  TResponse
} from '../../../common'
import { userCrudMessages } from '../language'
import { getInfoUser } from '../utils'

export const checkUserExists = async (
  { params, headers }: TRequest,
  response: TResponse,
  next: TNext
) => {
  const { idUser } = params
  const { lang } = getInfoHeaders(headers)
  const {
    warning: { notFound = '' } = {},
    error: { validationFailed = '', unexpectedError = '' } = {}
  } = userCrudMessages[lang]

  try {
    if (!idUser) {
      return handleErrors(
        { message: validationFailed, statusCode: 400 },
        response
      )
    }

    const existingUser = await getInfoUser({
      publicId: idUser
    })
    if (!existingUser) {
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
        message: unexpectedError,
        statusCode: 500,
        data: error
      },
      response
    )
  }
}
