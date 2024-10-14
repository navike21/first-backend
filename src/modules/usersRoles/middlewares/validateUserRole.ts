import { ValidationError } from 'joi'
import {
  getInfoHeaders,
  handleErrors,
  IRequest,
  TNext,
  TRequest,
  TResponse
} from '../../../common'
import { UserRoleSchema } from '../schemas'

export async function validateUserRole(
  { body, headers }: TRequest,
  response: TResponse,
  next: TNext
) {
  try {
    const { lang } = getInfoHeaders(headers)
    const schema = UserRoleSchema(lang)

    const { data } = body as IRequest

    await schema.validateAsync(data, {
      abortEarly: false
    })

    next()
  } catch (error) {
    const { details, message } = error as ValidationError
    handleErrors(
      {
        message,
        statusCode: 400,
        data: details
      },
      response
    )
  }
}
