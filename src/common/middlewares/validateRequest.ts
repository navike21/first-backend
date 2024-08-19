import { Request, Response, NextFunction } from 'express'
import { TLanguage } from '../types'
import { EN } from '../constants'
import { RequestSchema } from '../schemas'
import { ValidationError } from 'joi'

export async function validateRequest(
  { body, headers }: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const lang = (headers['accept-language'] as TLanguage) ?? EN
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
