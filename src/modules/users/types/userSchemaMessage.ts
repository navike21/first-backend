import { IValidationSchema } from '../../../common'
import { IUser } from './user'

export type TUserSchemaMessage = {
  [K in keyof IUser]: IValidationSchema
}
