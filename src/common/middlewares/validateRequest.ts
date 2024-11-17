import { RequestSchema } from '../schemas'
import { ValidationError } from 'joi'
import { getInfoHeaders, handleErrors } from '../utils'
import { TNext, TRequest, TResponse } from '../types'

export async function validateRequest(
  { body, headers, method }: TRequest,
  response: TResponse,
  next: TNext
): Promise<void> {
  const { lang, filesContent } = getInfoHeaders(headers)
  if (
    method === 'GET' ||
    (method === 'DELETE' && Object.keys(body).length === 0) ||
    filesContent
  ) {
    return next()
  }

  try {
    await RequestSchema(lang).validateAsync(body, {
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
