import Joi from 'joi'
import { DEFAULT_LANGUAGE, TLanguage } from '../../../common'
import { userAuthMessages } from '../language'
import { TUserAuthMessage } from '../types'

export const AuthPasswordSchema = (lang: TLanguage = DEFAULT_LANGUAGE) => {
  const {
    password: {
      validation: {
        isString: isStringPassword = '',
        isRequired: isRequiredPassword = ''
      } = {}
    } = {}
  } = userAuthMessages[lang]

  return Joi.object<TUserAuthMessage>({
    confirmPassword: Joi.string().required().messages({
      'string.base': isStringPassword,
      'any.required': isRequiredPassword,
      'string.empty': isRequiredPassword
    }),
    password: Joi.string().required().messages({
      'string.base': isStringPassword,
      'any.required': isRequiredPassword,
      'string.empty': isRequiredPassword
    })
  })
}
