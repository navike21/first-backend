import Joi from 'joi'
import { DEFAULT_LANGUAGE, TLanguage } from '../../../common'

export const UpdatePasswordSchema = (lang: TLanguage = DEFAULT_LANGUAGE) => {
  return Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email should be a type of text',
      'string.email': 'Email should be a valid email',
      'any.required': 'Email is required',
      'string.empty': 'Email should not be empty'
    }),
    password: Joi.string().min(8).max(50).required().messages({
      'string.base': 'Password should be a type of text',
      'string.min': 'Password should have a minimum length of {#limit}',
      'string.max': 'Password should have a maximum length of {#limit}',
      'any.required': 'Password is required',
      'string.empty': 'Password should not be empty'
    })
  })
}
