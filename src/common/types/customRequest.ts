import { IMeta } from './requestSchema'

export interface ICustomRequest {
  statusCode: number
  message: string
  data?: unknown
  meta?: IMeta
}
