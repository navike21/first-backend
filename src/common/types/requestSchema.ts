import { IValidationSchema } from './validationSchema'

export interface IRequest {
  data: object
}

export type TRequestSchemaMessage = {
  [K in keyof IRequest]: IValidationSchema
}
