import Joi from 'joi'
import {
  DEFAULT_LANGUAGE,
  TLanguage,
  EActions,
  DE,
  EN,
  ES,
  FR,
  IT,
  JP,
  KO,
  PT
} from '../../../common'
import { IUserRole } from '../types'
import { userRoleSchemaMessage } from '../language'

const languages = [DE, EN, ES, FR, IT, JP, KO, PT] as const

export const UserRoleSchema = (lang: TLanguage = DEFAULT_LANGUAGE) => {
  const {
    name: {
      isString: isStringName = '',
      minLength: minLengthName = '',
      maxLength: maxLengthName = '',
      isRequired: isRequiredName = ''
    },
    role: {
      isString: isStringRole = '',
      isPattern: patternRole = '',
      minLength: minLengthRole = '',
      maxLength: maxLengthRole = '',
      isRequired: isRequiredRole = ''
    },
    systemModules: {
      isObject: isObjectSystemModules = '',
      isRequired: isRequiredSystemModules = '',
      minLength: minLengthSystemModules = ''
    }
  } = userRoleSchemaMessage[lang]

  return Joi.object<IUserRole>({
    name: Joi.object(
      languages.reduce(
        (acc, lang) => {
          acc[lang] = Joi.string().min(2).max(50).optional().messages({
            'string.base': isStringName,
            'string.min': minLengthName,
            'string.max': maxLengthName,
            'any.required': isRequiredName
          })
          return acc
        },
        {} as Record<string, Joi.StringSchema>
      )
    ).required(),

    role: Joi.string()
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .min(4)
      .max(10)
      .required()
      .messages({
        'string.base': isStringRole,
        'string.pattern.base': patternRole,
        'string.min': minLengthRole,
        'string.max': maxLengthRole,
        'any.required': isRequiredRole
      }),

    systemModules: Joi.object()
      .pattern(
        Joi.string(),
        Joi.object({
          [EActions.CREATE]: Joi.boolean().default(false),
          [EActions.READ]: Joi.boolean().default(false),
          [EActions.UPDATE]: Joi.boolean().default(false),
          [EActions.DELETE]: Joi.boolean().default(false),
          [EActions.RESTORE]: Joi.boolean().default(false),
          [EActions.DELETE_PERMANENTLY]: Joi.boolean().default(false)
        })
      )
      .min(1)
      .required()
      .messages({
        'object.base': isObjectSystemModules,
        'object.empty': isRequiredSystemModules,
        'object.min': minLengthSystemModules
      })
  }).messages({
    'any.required': isRequiredSystemModules
  })
}
