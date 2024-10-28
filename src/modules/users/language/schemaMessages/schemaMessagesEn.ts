import { TUserSchemaMessage } from '../../types'

export const schemaMessagesEn: TUserSchemaMessage = {
  documentId: {
    isString: 'The document ID must be a string',
    minLength: 'The document ID must be at least 8 characters long',
    maxLength: 'The document ID must be at most 8 characters long',
    isRequired: 'The document ID is required'
  },
  email: {
    isString: 'The email must be a string',
    isEmail: 'The email must be valid',
    isRequired: 'The email is required'
  },
  fatherLastName: {
    isString: 'The father’s last name must be a string',
    minLength: 'The father’s last name must be at least 2 characters long',
    maxLength: 'The father’s last name must be at most 50 characters long',
    isRequired: 'The father’s last name is required'
  },
  image: {
    isString: 'The image URL must be a string',
    isUrl: 'The image URL must be valid'
  },
  motherLastName: {
    isString: 'The mother’s last name must be a string',
    minLength: 'The mother’s last name must be at least 2 characters long',
    maxLength: 'The mother’s last name must be at most 50 characters long',
    isRequired: 'The mother’s last name is required'
  },
  names: {
    isString: 'The name must be a string',
    minLength: 'The name must be at least 2 characters long',
    maxLength: 'The name must be at most 50 characters long',
    isRequired: 'The name is required'
  },
  phone: {
    isString: 'The phone number must be a string',
    minLength: 'The phone number must be at least 7 characters long',
    maxLength: 'The phone number must be at most 15 characters long'
  },
  dateOfBirth: {
    isDate: 'The date of birth must be a valid date'
  }
}
