import { ValidationError } from 'joi'
import { getInfoHeaders, IRequest, TNext, TRequest, TResponse } from '../../../common'
import { UserSchema } from '../schemas'

export async function validateUser(
  { body, headers }: TRequest,
  res: TResponse,
  next: TNext
) {
  try {
    const { lang } = getInfoHeaders(headers)
    const schema = UserSchema(lang)

    const { data } = body as IRequest

    await schema.validateAsync(data, {
      abortEarly: false
    })
    next()
  } catch (error) {
    const { details, message } = error as ValidationError

    res.status(400).send({ message: message, details })
  }
}
