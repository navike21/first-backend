import { model } from 'mongoose'
import { userModelSchema } from '../schemas'
import { IUserDocument } from '../types'

export const UserModel = model<IUserDocument>('User', userModelSchema)
