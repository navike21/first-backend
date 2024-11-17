import Joi from 'joi'
import { IRequest, TLanguage } from '../types'
import { requestMessageSchema } from '../languages'
import { DEFAULT_LANGUAGE } from '../constants'

export const RequestSchema = (lang: TLanguage = DEFAULT_LANGUAGE) => {
  const {
    data: { isObject, isRequired }
  } = requestMessageSchema[lang]

  return Joi.object<IRequest>({
    data: Joi.object()
      .required()
      .messages({
        'any.required': `${isRequired}`,
        'object.base': `${isObject}`
      }),
    meta: Joi.object({
      page: Joi.number().integer().positive().optional(),
      limit: Joi.number().integer().positive().optional()
    }).optional(),
    filters: Joi.object().optional(),
    sort: Joi.object().optional()
  })
}
