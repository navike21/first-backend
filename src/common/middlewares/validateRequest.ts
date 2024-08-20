import { Request, Response, NextFunction } from 'express'
import { RequestSchema } from '../schemas'
import { ValidationError } from 'joi'
import { getInfoHeaders } from '../utils'

export async function validateRequest(
  { body, headers }: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { lang } = getInfoHeaders(headers)
    const schema = RequestSchema(lang)

    await schema.validateAsync(body, {
      abortEarly: true
    })
    next()
  } catch (error) {
    const { details, message } = error as ValidationError

    res.status(400).send({ message: message, details })
  }
}
