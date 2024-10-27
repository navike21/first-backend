import Joi from 'joi'
import { DEFAULT_LANGUAGE, TLanguage } from '../../../common'
import { userSchemaMessage } from '../language'
import { IUser } from '../types'

export const UserSchema = (lang: TLanguage = DEFAULT_LANGUAGE) => {
  const {
    dateOfBirth: { isDate: isDateDateOfBirth = '' },
    documentId: {
      isString: isStringDocumentId = '',
      minLength: minLengthDocumentId = '',
      maxLength: maxLengthDocumentId = '',
      isRequired: isRequiredDocumentId = ''
    },
    email: {
      isString: isStringEmail = '',
      isEmail: isEmailEmail = '',
      isRequired: isRequiredEmail = ''
    },
    fatherLastName: {
      isString: isStringFatherLastName = '',
      minLength: minLengthFatherLastName = '',
      maxLength: maxLengthFatherLastName = '',
      isRequired: isRequiredFatherLastName = ''
    },
    image: { isString: isStringImage = '', isUrl: isUrlImage = '' },
    motherLastName: {
      isString: isStringMotherLastName = '',
      minLength: minLengthMotherLastName = '',
      maxLength: maxLengthMotherLastName = '',
      isRequired: isRequiredMotherLastName = ''
    },
    names: {
      isString: isStringName = '',
      minLength: minLengthName = '',
      maxLength: maxLengthName = '',
      isRequired: isRequiredName = ''
    },
    phone: {
      isString: isStringPhone = '',
      minLength: minLengthPhone = '',
      maxLength: maxLengthPhone = ''
    }
  } = userSchemaMessage[lang]

  return Joi.object<IUser>({
    dateOfBirth: Joi.date().messages({
      'date.base': isDateDateOfBirth
    }),
    documentId: Joi.string().min(8).max(8).required().messages({
      'string.base': isStringDocumentId,
      'string.min': minLengthDocumentId,
      'string.max': maxLengthDocumentId,
      'any.required': isRequiredDocumentId,
      'string.empty': isRequiredDocumentId
    }),
    email: Joi.string().email().required().messages({
      'string.base': isStringEmail,
      'string.email': isEmailEmail,
      'any.required': isRequiredEmail,
      'string.empty': isRequiredEmail
    }),
    fatherLastName: Joi.string().min(2).max(50).required().messages({
      'string.base': isStringFatherLastName,
      'string.min': minLengthFatherLastName,
      'string.max': maxLengthFatherLastName,
      'any.required': isRequiredFatherLastName,
      'string.empty': isRequiredFatherLastName
    }),
    image: Joi.string().uri().messages({
      'string.base': isStringImage,
      'string.uri': isUrlImage
    }),
    motherLastName: Joi.string().min(2).max(50).required().messages({
      'string.base': isStringMotherLastName,
      'string.min': minLengthMotherLastName,
      'string.max': maxLengthMotherLastName,
      'any.required': isRequiredMotherLastName,
      'string.empty': isRequiredMotherLastName
    }),
    names: Joi.string().min(2).max(50).required().messages({
      'string.base': isStringName,
      'string.min': minLengthName,
      'string.max': maxLengthName,
      'any.required': isRequiredName,
      'string.empty': isRequiredName
    }),
    phone: Joi.string().min(7).max(15).messages({
      'string.base': isStringPhone,
      'string.min': minLengthPhone,
      'string.max': maxLengthPhone
    })
  })
}
