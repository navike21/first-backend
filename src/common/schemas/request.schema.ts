import Joi from 'joi'
import { TLanguage } from '../types'
import { requestMessageSchema } from '../languages'

export const RequestSchema = (lang: TLanguage) => {
  const {
    data: { isObject = '', isRequired = '' }
  } = requestMessageSchema[lang]

  return Joi.object({
    data: Joi.object().required().messages({
      'any.required': isRequired,
      'object.base': isObject
    })
  })
}
