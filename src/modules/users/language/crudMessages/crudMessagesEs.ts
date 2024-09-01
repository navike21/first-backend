import { IMessages } from '../../../../common'

export const crudMessagesEs: IMessages = {
  success: {
    created: 'Usuario creado con éxito',
    updated: 'Usuario actualizado con éxito',
    deleted: 'Usuario eliminado con éxito',
    retrieved: 'Usuario recuperado con éxito',
    list: 'Se listaron los usuarios con éxito',
    found: 'Usuario encontrado'
  },
  error: {
    creationFailed: 'Error al crear el usuario',
    updateFailed: 'Error al actualizar el usuario',
    deletionFailed: 'Error al eliminar el usuario',
    retrievalFailed: 'Error al recuperar el usuario',
    listFailed: 'Error al listar los usuarios',
    searchFailed: 'Error al buscar el usuario',
    validationFailed: 'Error de validación',
    duplicate: 'El usuario ya se encuentra registrado',
    connectionError: 'Error de conexión',
    databaseError: 'Error de base de datos',
    unexpectedError: 'Error inesperado',
    queryFailed: 'Error de consulta'
  },
  warning: {
    notFound: 'El usuario no fue encontrado',
    notUpdated: 'El usuario no fue actualizado',
    notDeleted: 'El usuario no fue eliminado',
    notRetrieved: 'El usuario no fue recuperado',
    notListed: 'No se pudieron listar los usuarios',
    notFoundSearch: 'No se encontró el usuario',
    notMore: 'No hay más usuarios para listar',
    isEmpty: 'No hay usuarios para listar en este momento'
  }
}
