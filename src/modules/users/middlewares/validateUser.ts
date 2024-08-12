import { ValidationError } from 'joi'
import { EN, TLanguage, TNext, TRequest, TResponse } from '../../../common'
import { UserSchema } from '../schemas'

export async function validateUser(
  { body, headers }: TRequest,
  res: TResponse,
  next: TNext
) {
  try {
    const lang = (headers['accept-language'] as TLanguage) ?? EN
    const schema = UserSchema(lang)

    await schema.validateAsync(body, {
      abortEarly: false
    })
    next()
  } catch (error) {
    const { details, message } = error as ValidationError

    res.status(400).send({ message: message, details })
  }
}
