import { ENG } from '../constants'
import { TRequest } from '../types'

export class HeadersClass {
  public getHeaderLanguage(request: TRequest): string {
    return request.headers['accept-language'] ?? ENG
  }
}
