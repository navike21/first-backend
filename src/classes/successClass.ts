import { SUCCESS } from '../constants'
import { TPayloadSuccess, TResponse } from '../types'
import { responseSuccess } from '../utils'

export class SuccessClass {
  public sendSuccessResponse = <T>(
    response: TResponse,
    data: T,
    message: string,
    code: number = 200
  ) => {
    const payload: TPayloadSuccess<T> = {
      code,
      data,
      message,
      status: SUCCESS
    }
    responseSuccess(response, payload)
  }
}
