import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesEs: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'El nombre del rol es requerido',
    isString: 'El nombre del rol debe ser una cadena',
    minLength: 'El nombre del rol debe tener al menos 2 caracteres',
    maxLength: 'El nombre del rol debe tener como máximo 50 caracteres'
  },
  role: {
    isRequired: 'El rol es requerido',
    isString: 'El rol debe ser una cadena',
    isPattern:
      'El rol solo puede contener letras, números, guiones (-) y guiones bajos (_), sin espacios',
    minLength: 'El rol debe tener al menos 4 caracteres',
    maxLength: 'El rol debe tener como máximo 10 caracteres'
  },
  systemModules: {
    isObject: 'Los módulos del sistema deben ser un objeto',
    isRequired: 'Los módulos del sistema son requeridos',
    minLength: 'Debe tener al menos un módulo de sistema'
  }
}
