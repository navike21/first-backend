import { TUpdatePasswordSchemaMessage } from '../../types'

export const schemaMessagesEs: TUpdatePasswordSchemaMessage = {
  email: {
    isString: 'El correo electrónico debe ser una cadena de texto',
    isRequired: 'El correo electrónico es requerido',
    isEmail: 'El correo electrónico no es válido'
  },
  password: {
    isRequired: 'La contraseña es requerida',
    minLength: 'La contraseña debe tener al menos 8 caracteres',
    maxLength: 'La contraseña debe tener como máximo 12 caracteres'
  },
  confirmPassword: {
    isRequired: 'La confirmación de la contraseña es requerida',
    minLength: 'La confirmación de la contraseña debe tener al menos 8 caracteres',
    maxLength: 'La confirmación de la contraseña debe tener como máximo 12 caracteres'
  }
}
