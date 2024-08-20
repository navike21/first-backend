import { ICustomRequest, TResponse } from '../types'

type TErrorHandler = (error: ICustomRequest, response: TResponse) => void

export const handleErrors: TErrorHandler = (error, response) => {
  const { message, statusCode = 500, data, meta } = error

  response.status(statusCode).send({
    message,
    data,
    meta
  })
}
