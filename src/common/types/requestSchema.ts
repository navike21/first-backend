import { IValidationSchema } from './validationSchema'

export interface IMeta {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}
export interface IRequest {
  data: object
  meta?: IMeta
}

export type TRequestSchemaMessage = {
  [K in keyof IRequest]: IValidationSchema
}
