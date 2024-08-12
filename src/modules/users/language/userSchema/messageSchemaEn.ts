export const messageSchemaEn = {
  documentId: {
    isString: 'The ID document must be a string',
    minLength: 'The ID document must be at least 8 characters long',
    maxLength: 'The ID document must be at most 8 characters long',
    isRequired: 'The ID document is required'
  },
  email: {
    isString: 'The email must be a string',
    isEmail: 'The email must be valid',
    isRequired: 'The email is required'
  },
  fatherLastName: {
    isString: "The father's last name must be a string",
    minLength: "The father's last name must be at least 2 characters long",
    maxLength: "The father's last name must be at most 50 characters long",
    isRequired: "The father's last name is required"
  },
  image: {
    isString: 'The image URL must be a string',
    isUrl: 'The image URL must be valid'
  },
  motherLastName: {
    isString: "The mother's last name must be a string",
    minLength: "The mother's last name must be at least 2 characters long",
    maxLength: "The mother's last name must be at most 50 characters long",
    isRequired: "The mother's last name is required"
  },
  name: {
    isString: 'The name must be a string',
    minLength: 'The name must be at least 2 characters long',
    maxLength: 'The name must be at most 50 characters long',
    isRequired: 'The name is required'
  },
  password: {
    isString: 'The password must be a string',
    minLength: 'The password must be at least 8 characters long',
    maxLength: 'The password must be at most 12 characters long',
    isRequired: 'The password is required'
  },
  phone: {
    isString: 'The phone number must be a string',
    minLength: 'The phone number must be at least 7 characters long',
    maxLength: 'The phone number must be at most 15 characters long'
  },
  dateOfBirth: {
    isDate: 'The dateOfBirth must be a date'
  }
}
