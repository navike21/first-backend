import { TPayloadError, TPayloadSuccess, TResponse } from '../types'

export const responseSuccess = <T>(response: TResponse, payload: TPayloadSuccess<T>) =>
  response.status(payload.code).json(payload)

export const responseError = (response: TResponse, error: TPayloadError) =>
  response.status(error.error.code ?? 500).json(error)
