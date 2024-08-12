import { TMessageUserSchema } from '../../types'

export const messageSchemaEs: TMessageUserSchema = {
  documentId: {
    isString: 'El documento de identidad debe ser una cadena',
    minLength: 'El documento de identidad debe tener al menos 8 caracteres',
    maxLength: 'El documento de identidad debe tener como máximo 8 caracteres',
    isRequired: 'El documento de identidad es obligatorio'
  },
  email: {
    isString: 'El correo electrónico debe ser una cadena',
    isEmail: 'El correo electrónico debe ser válido',
    isRequired: 'El correo electrónico es obligatorio'
  },
  fatherLastName: {
    isString: 'El apellido paterno debe ser una cadena',
    minLength: 'El apellido paterno debe tener al menos 2 caracteres',
    maxLength: 'El apellido paterno debe tener como máximo 50 caracteres',
    isRequired: 'El apellido paterno es obligatorio'
  },
  image: {
    isString: 'La url de imagen debe ser una cadena',
    isUrl: 'La url de imagen debe ser válida'
  },
  motherLastName: {
    isString: 'El apellido materno debe ser una cadena',
    minLength: 'El apellido materno debe tener al menos 2 caracteres',
    maxLength: 'El apellido materno debe tener como máximo 50 caracteres',
    isRequired: 'El apellido materno es obligatorio'
  },
  name: {
    isString: 'El nombre debe ser una cadena',
    minLength: 'El nombre debe tener al menos 2 caracteres',
    maxLength: 'El nombre debe tener como máximo 50 caracteres',
    isRequired: 'El nombre es obligatorio'
  },
  password: {
    isString: 'La contraseña debe ser una cadena',
    minLength: 'La contraseña debe tener al menos 8 caracteres',
    maxLength: 'La contraseña debe tener como máximo 12 caracteres',
    isRequired: 'La contraseña es obligatoria'
  },
  phone: {
    isString: 'El teléfono debe ser una cadena',
    minLength: 'El teléfono debe tener al menos 7 caracteres',
    maxLength: 'El teléfono debe tener como máximo 15 caracteres'
  },
  dateOfBirth: {
    isDate: 'La fecha de nacimiento debe ser una fecha'
  }
}
