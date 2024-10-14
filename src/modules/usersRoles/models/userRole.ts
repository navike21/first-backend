import { model } from 'mongoose'
import { IUserRole } from '../types'
import { userRoleModelSchema } from '../schemas'

export const UserRoleModel = model<IUserRole>('Users_Role', userRoleModelSchema)
