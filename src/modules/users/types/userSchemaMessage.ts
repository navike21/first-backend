import { IValidationSchema } from '../../../common'
import { TUserOmitted } from './user'

export type TUserSchemaMessage = {
  [K in keyof TUserOmitted]: IValidationSchema
}
