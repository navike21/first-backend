import { WARNING } from '../constants'
import { TPayloadError, TResponse } from '../types'
import { handleStringToJSON, responseError } from '../utils'

export class ErrorClass {
  public handleError = (
    response: TResponse,
    error: Error,
    defaultMessage: string = 'An error occurred'
  ) => {
    console.error(error)
    const errorProps = error
    const errorParsed = handleStringToJSON(errorProps.message)
    const payloadError: TPayloadError = {
      error: {
        code: 500,
        message: errorParsed.message || defaultMessage,
        data: errorParsed.data || null
      },
      status: WARNING
    }
    responseError(response, payloadError)
  }
}
