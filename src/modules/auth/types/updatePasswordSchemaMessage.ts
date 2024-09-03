import { IValidationSchema } from '../../../common'
import { TRequestUpdatePassword } from './requestUpdatePassword'

export type TUpdatePasswordSchemaMessage = {
  [K in keyof TRequestUpdatePassword]: IValidationSchema
}
