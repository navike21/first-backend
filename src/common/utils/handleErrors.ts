import { ErrorDescription } from 'mongodb'
import { ICustomError, TResponse } from '../types'

interface IError {
  message: string
  details?: string | ErrorDescription
}

type TErrorHandler = (error: ICustomError, res: TResponse) => void

export const handleErrors: TErrorHandler = (error, res) => {
  const { message, statusCode = 500, details } = error

  res.status(statusCode).send({
    message,
    details
  } as IError)
}
