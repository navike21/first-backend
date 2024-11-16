import {
  getInfoHeaders,
  IRequest,
  TRequest,
  TResponse,
  handleErrors,
  handleSuccess,
  ECollectionState,
  verifyPassword,
  generateJwtToken
} from '../../../common'
import { userAuthMessages } from '../language'
import { ILogin } from '../types'
import { getInfoUser } from '../../users/utils'

export const login = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest

  const {
    login: {
      success: { completed: loginComplete } = {},
      warning: {
        notFound: userNotFound,
        isBlocked: userBlocked,
        notMatch: passwordNotMatch
      } = {},
      error: { unexpectedError } = {},
      password: { isMissing: passwordIsMissing } = {}
    }
  } = userAuthMessages[lang]

  const { email, password } = data as ILogin

  try {
    const existingUser = await getInfoUser({
      email
    })

    if (!existingUser) {
      return handleErrors(
        { message: `${userNotFound}`, statusCode: 404 },
        response
      )
    } else {
      const {
        auth: { password: passwordData } = {},
        state,
        names: userName,
        fatherLastName,
        motherLastName
      } = existingUser

      if (!passwordData) {
        return handleErrors(
          { message: `${passwordIsMissing}`, statusCode: 400 },
          response
        )
      }

      if (state === ECollectionState.BLOCKED) {
        return handleErrors(
          { message: `${userBlocked}`, statusCode: 400 },
          response
        )
      }

      if (!verifyPassword(password, passwordData)) {
        return handleErrors(
          { message: `${passwordNotMatch}`, statusCode: 401 },
          response
        )
      }

      const token = await generateJwtToken({
        email,
        names: userName,
        fatherLastName,
        motherLastName
      })

      handleSuccess(
        {
          message: `${loginComplete}`,
          statusCode: 200,
          data: {
            token
          }
        },
        response
      )
    }
  } catch (error) {
    handleErrors(
      {
        message: `${unexpectedError}`,
        statusCode: 500,
        data: error
      },
      response
    )
  }
}
