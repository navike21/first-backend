import { ICustomRequest, TResponse } from '../types'

type TErrorHandler = (error: ICustomRequest, response: TResponse) => void

export const handleErrors: TErrorHandler = (error, response) => {
  const { message, statusCode, data, meta } = error

  response.status(statusCode).json({
    message,
    data,
    meta
  })
}
