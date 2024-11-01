export interface IValidationSchema {
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
  isObject?: string
  isPattern?: string
  isEmpty?: string
  isMissing?: string
  isMatch?: string
  isExpired?: string
}
