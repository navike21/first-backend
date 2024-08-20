import { ICustomRequest, TResponse } from '../types'

type TErrorHandler = (error: ICustomRequest, response: TResponse) => void

export const handleErrors: TErrorHandler = (error, response) => {
  const { message, statusCode = 500, details, meta } = error

  response.status(statusCode).send({
    message,
    details,
    meta
  })
}
