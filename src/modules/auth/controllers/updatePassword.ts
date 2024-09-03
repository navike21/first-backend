import bcrypt from 'bcrypt'
import {
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { userCollection } from '../../users/controllers/config'
import { TRequestUpdatePassword } from '../types'
import { updatePasswordUserMessages } from '../language'

export const updatePassword = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest

  const {
    success: { updated = '' } = {},
    warning: { notMatch = '' } = {},
    error: { unexpectedError = '' } = {}
  } = updatePasswordUserMessages[lang]

  const { email, password, confirmPassword } = data as TRequestUpdatePassword

  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, saltRounds)

    if (hashedPassword !== hashedConfirmPassword) {
      handleErrors(
        {
          message: notMatch,
          statusCode: 400
        },
        response
      )
    }

    await (
      await userCollection
    ).findOneAndReplace(
      { email },
      {
        $set: {
          auth: {
            password: hashedPassword
          }
        }
      }
    )

    handleSuccess(
      {
        message: updated,
        statusCode: 200
      },
      response
    )
  } catch (error) {
    console.log('****error****', error)
    handleErrors(
      {
        message: unexpectedError,
        statusCode: 500
      },
      response
    )
  }
}
