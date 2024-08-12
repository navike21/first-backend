import { IUser } from './user'

type ValidationMessages = {
  isString?: string
  isEmail?: string
  isDate?: string
  minLength?: string
  maxLength?: string
  isRequired?: string
  isIn?: string
  isNumber?: string
  isBoolean?: string
  isUrl?: string
}

export type TMessageUserSchema = {
  [K in keyof IUser]: ValidationMessages
}
