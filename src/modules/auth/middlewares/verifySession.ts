import { VerifyErrors } from 'jsonwebtoken'
import {
  getInfoHeaders,
  handleErrors,
  TNext,
  TRequest,
  TResponse,
  verifyJwtToken
} from '../../../common'
import { userAuthMessages } from '../language'

const sendErrorResponse = (
  message: string,
  statusCode: number,
  response: TResponse
) => {
  return handleErrors({ message, statusCode }, response)
}

export const verifySession = async (
  { headers }: TRequest,
  response: TResponse,
  next: TNext
) => {
  const { authorization, lang } = getInfoHeaders(headers)

  const {
    session: {
      token: { isMissing: tokenIsMissing, isMatch: invalidToken },
      validation: {
        warning: {
          notMatch: sessionIsNotValid,
          isExpired: sessionExpired
        } = {},
        error: { unexpectedError: sessionUnexpectedError } = {
          unexpectedError: ''
        }
      }
    }
  } = userAuthMessages[lang]

  try {
    if (!authorization) {
      return sendErrorResponse(`${tokenIsMissing}`, 400, response)
    }

    const jwtToken = authorization.split(' ').pop()
    if (!jwtToken) {
      return sendErrorResponse(`${invalidToken}`, 401, response)
    }

    const isValidJwt = verifyJwtToken(jwtToken)
    if (!isValidJwt) {
      return sendErrorResponse(`${sessionIsNotValid}`, 401, response)
    }

    next()
  } catch (error) {
    const errorCatch = error as VerifyErrors
    const { name } = errorCatch

    if (name === 'JsonWebTokenError') {
      return sendErrorResponse(`${invalidToken}`, 401, response)
    }

    if (name === 'TokenExpiredError') {
      return sendErrorResponse(`${sessionExpired}`, 401, response)
    }

    return sendErrorResponse(`${sessionUnexpectedError}`, 500, response)
  }
}
