import { IValidationSchema } from '../../../common'
import { TUserRoleOmitted } from './userRole'

export type TUserRoleSchemaMessage = {
  [K in keyof TUserRoleOmitted]: IValidationSchema
}
