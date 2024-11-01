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
  },
  login: {
    success: {
      completed: 'Inicio de sesión satisfactorio'
    },
    error: {
      validationFailed: 'Error de validación en el inicio de sesión',
      unexpectedError: 'Error inesperado en el inicio de sesión'
    },
    warning: {
      notMatch: 'Contraseña incorrecta',
      isBlocked: 'El usuario se encuentra bloqueado',
      notFound: 'El usuario no se encuentra registrado'
    },
    email: {
      isEmail: 'El email debe ser un email válido',
      isRequired: 'El email es requerido',
      isString: 'El email debe ser una cadena de texto'
    },
    password: {
      isString: 'La contraseña debe ser un string',
      isRequired: 'La contraseña es requerida',
      minLength: 'La contraseña debe tener al menos 6 caracteres de longitud',
      isMissing: 'La contraseña no se encuentra registrada'
    }
  },
  session: {
    token: {
      isString: 'El token debe ser un string',
      isRequired: 'El token es requerido',
      isMissing: 'No se encontró el token',
      isMatch: 'El token no es válido'
    },
    validation: {
      success: {
        completed: 'Sesión validada correctamente'
      },
      error: {
        validationFailed: 'Error de validación en la sesión',
        unexpectedError: 'Error inesperado en la validación de la sesión'
      },
      warning: {
        notMatch: 'Sesión no válida',
        isExpired: 'El token de la sesión ha expirado'
      }
    }
  }
}
