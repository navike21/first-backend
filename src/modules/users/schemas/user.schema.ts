import joi from 'joi'
import { TLanguage } from '../../../common'
import { userMessageSchema } from '../language'

export const UserSchema = (lang: TLanguage) => {
  const {
    documentId: {
      isString: isStringDocumentId = '',
      minLength: minLengthDocumentId = '',
      maxLength: maxLengthDocumentId = '',
      isRequired: isRequiredDocumentId = ''
    },
    email: { isString: isStringEmail = '', isEmail: isEmailEmail = '' },
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
    name: {
      isString: isStringName = '',
      minLength: minLengthName = '',
      maxLength: maxLengthName = '',
      isRequired: isRequiredName = ''
    },
    password: {
      isString: isStringPassword = '',
      minLength: minLengthPassword = '',
      maxLength: maxLengthPassword = '',
      isRequired: isRequiredPassword = ''
    },
    phone: {
      isString: isStringPhone = '',
      minLength: minLengthPhone = '',
      maxLength: maxLengthPhone = ''
    }
  } = userMessageSchema[lang]

  return joi.object({
    documentId: joi.string().min(8).max(8).required().messages({
      'string.base': isStringDocumentId,
      'string.min': minLengthDocumentId,
      'string.max': maxLengthDocumentId,
      'any.required': isRequiredDocumentId
    }),
    email: joi.string().email().required().messages({
      'string.base': isStringEmail,
      'string.email': isEmailEmail,
      'any.required': isRequiredDocumentId
    }),
    fatherLastName: joi.string().min(2).max(50).required().messages({
      'string.base': isStringFatherLastName,
      'string.min': minLengthFatherLastName,
      'string.max': maxLengthFatherLastName,
      'any.required': isRequiredFatherLastName
    }),
    image: joi.string().uri().messages({
      'string.base': isStringImage,
      'string.uri': isUrlImage
    }),
    motherLastName: joi.string().min(2).max(50).required().messages({
      'string.base': isStringMotherLastName,
      'string.min': minLengthMotherLastName,
      'string.max': maxLengthMotherLastName,
      'any.required': isRequiredMotherLastName
    }),
    name: joi.string().min(2).max(50).required().messages({
      'string.base': isStringName,
      'string.min': minLengthName,
      'string.max': maxLengthName,
      'any.required': isRequiredName
    }),
    password: joi.string().min(8).required().messages({
      'string.base': isStringPassword,
      'string.min': minLengthPassword,
      'any.required': isRequiredPassword
    }),
    phone: joi.string().min(7).max(15).messages({
      'string.base': isStringPhone,
      'string.min': minLengthPhone,
      'string.max': maxLengthPhone
    })
  })
}
