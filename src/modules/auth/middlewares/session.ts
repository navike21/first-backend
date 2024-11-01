import {
  getInfoHeaders,
  handleErrors,
  TNext,
  TRequest,
  TResponse,
  verifyJwtToken
} from '../../../common'
import { userAuthMessages } from '../language'

export const verifySession = async (
  { headers }: TRequest,
  response: TResponse,
  next: TNext
) => {
  const { authorization, lang } = getInfoHeaders(headers)

  const {
    session: {
      token: {
        isMissing: tokenIsMissing = '',
        isMatch: invalidToken = ''
      } = {},
      validation: {
        warning: {
          notMatch: sessionIsNotValid = '',
          isExpired: sessionExpired = ''
        } = {},
        error: { unexpectedError: sessionUnexpectedError = '' } = {}
      } = {}
    } = {}
  } = userAuthMessages[lang]

  try {
    if (!authorization) {
      return handleErrors(
        { message: tokenIsMissing, statusCode: 400 },
        response
      )
    }

    const jwtToken = authorization.split(' ').pop() ?? ''
    const verifyJwt = verifyJwtToken(jwtToken)

    if (!verifyJwt) {
      return handleErrors(
        { message: sessionIsNotValid, statusCode: 401 },
        response
      )
    }

    next()
  } catch (error) {
    const { name = '' } = error as Error

    if (name === 'JsonWebTokenError') {
      return handleErrors(
        { message: invalidToken, statusCode: 401, data: error },
        response
      )
    }

    if (name === 'TokenExpiredError') {
      return handleErrors(
        { message: sessionExpired, statusCode: 401, data: error },
        response
      )
    }

    return handleErrors(
      {
        message: sessionUnexpectedError,
        statusCode: 500,
        data: error
      },
      response
    )
  }
}
