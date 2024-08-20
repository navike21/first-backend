import { ICustomRequest, TResponse } from '../types'

type TSuccessHandler = (success: ICustomRequest, response: TResponse) => void

export const handleSuccess: TSuccessHandler = (success, response) => {
  const { message, data, statusCode = 200, meta } = success

  response.status(statusCode).send({
    message,
    data,
    meta
  })
}
