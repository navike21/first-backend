import { TUserAuthMessage } from '../../types'

export const authMessagesEs: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Contraseña actualizada correctamente',
      created: 'Contraseña creada correctamente',
      retrieved: 'Contraseña recuperada correctamente'
    },
    error: {
      updateFailed: 'Error al actualizar la contraseña',
      creationFailed: 'Error al crear la contraseña',
      retrievalFailed: 'Error al recuperar la contraseña',
      validationFailed: 'Error de validación',
      unexpectedError: 'Error inesperado'
    },
    warning: {
      notMatch: 'Las contraseñas no coinciden',
      isEmpty: 'La contraseña no puede estar vacía'
    },
    validation: {
      isString: 'La contraseña debe ser un string',
      isRequired: 'La contraseña es requerida'
    }
  }
}
