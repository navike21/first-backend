import Joi from 'joi'
import { DEFAULT_LANGUAGE, TLanguage } from '../../../common'
import { fileMessages } from '../language'
import { TValidationSchemaFiles } from '../types'

export const DeleteMultipleFilesSchema = (
  lang: TLanguage = DEFAULT_LANGUAGE
) => {
  const {
    validation: {
      idFiles: { isRequired = '', isArray = '', isString = '' } = {}
    }
  } = fileMessages[lang]

  return Joi.object<TValidationSchemaFiles>({
    idFiles: Joi.array()
      .items(
        Joi.string().required().messages({
          'string.base': isString
        })
      )
      .min(1)
      .required()
      .messages({
        'any.required': isRequired,
        'array.base': isArray,
        'array.min': isRequired,
        'array.includesRequiredUnknowns': isRequired
      })
  })
}
