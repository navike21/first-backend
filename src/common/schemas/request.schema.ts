import Joi from 'joi'
import { TLanguage } from '../types'
import { requestMessageSchema } from '../languages'
import { EN } from '../constants'

export const RequestSchema = (lang: TLanguage = EN) => {
  const {
    data: { isObject = '', isRequired = '' }
  } = requestMessageSchema[lang]

  return Joi.object({
    data: Joi.object().required().messages({
      'any.required': isRequired,
      'object.base': isObject
    }),
    meta: Joi.object({
      page: Joi.number().integer().positive().optional(),
      limit: Joi.number().integer().positive().optional()
    }).optional(),
    filters: Joi.object().optional(),
    sort: Joi.object().optional()
  })
}
