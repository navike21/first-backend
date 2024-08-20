import { IMeta } from './requestSchema'

export interface ICustomRequest {
  statusCode: number
  message: string
  details?: unknown
  meta?: IMeta
}
