import { ERROR, SUCCESS, WARNING } from '../constants'

export interface IError {
  code?: number
  message: string
  data?: object
}

export type TResponseStatus = typeof SUCCESS | typeof WARNING | typeof ERROR

export type TPayloadSuccess<T> = {
  code: number
  data: T
  message: string
  status: TResponseStatus
}

export type TPayloadError = {
  error: IError
  status: TResponseStatus
}
