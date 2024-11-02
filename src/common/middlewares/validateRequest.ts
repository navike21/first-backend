import { Request, Response, NextFunction } from 'express'
import { RequestSchema } from '../schemas'
import { ValidationError } from 'joi'
import { getInfoHeaders, handleErrors } from '../utils'

export async function validateRequest(
  { body, headers, method }: Request,
  response: Response,
  next: NextFunction
) {
  if (method === 'GET' || method === 'DELETE') {
    return next()
  }
  const { lang, filesContent } = getInfoHeaders(headers)

  if (filesContent) {
    return next()
  }

  try {
    const schema = RequestSchema(lang)

    await schema.validateAsync(body, {
      abortEarly: true
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
