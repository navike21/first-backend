import { IMessages } from '../../../../common'

export const crudMessagesEs: IMessages = {
  success: {
    created: 'Rol creado con éxito',
    updated: 'Rol actualizado con éxito',
    deleted: 'rol eliminado con éxito',
    retrieved: 'Rol recuperado con éxito',
    list: 'Se listaron los roles con éxito',
    found: 'Rol encontrado'
  },
  error: {
    creationFailed: 'Error al crear el rol',
    updateFailed: 'Error al actualizar el rol',
    deletionFailed: 'Error al eliminar el usuario',
    retrievalFailed: 'Error al recuperar el rol',
    listFailed: 'Error al listar los roles',
    searchFailed: 'Error al buscar el rol',
    validationFailed: 'Error de validación',
    duplicate: 'El rol ya se encuentra registrado',
    connectionError: 'Error de conexión',
    databaseError: 'Error de base de datos',
    unexpectedError: 'Error inesperado',
    queryFailed: 'Error de consulta'
  },
  warning: {
    notFound: 'El rol no fue encontrado',
    notUpdated: 'El rol no fue actualizado',
    notDeleted: 'El rol no fue eliminado',
    notRetrieved: 'El rol no fue recuperado',
    notListed: 'No se pudieron listar los roles',
    notFoundSearch: 'No se encontró el rol',
    notMore: 'No hay más roles para listar',
    isEmpty: 'No hay roles para listar en este momento'
  }
}
