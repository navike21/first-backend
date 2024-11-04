import { TFilesMessage } from '../../types'

export const filesMessagesEs: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Error al subir los archivos',
      unexpectedError: 'Error inesperado',
      deletionFailed: 'Error al eliminar los archivos'
    },
    success: {
      completed: 'Los archivos se subieron correctamente',
      list: 'Se listaron los archivos correctamente',
      deleted: 'Archivos eliminados correctamente'
    },
    warning: {
      notFound: 'No se encontraron los archivos',
      notFoundToDelete: 'No se encontraron los archivos a eliminar',
      notDeleted: 'No se pudieron eliminar los archivos',
      notRetrieved: 'No se pudieron recuperar los archivos',
      notFoundSearch:
        'No se encontraron archivos con los criterios de búsqueda',
      notMore: 'No hay más archivos para mostrar'
    }
  },
  file: {
    error: {
      deletionFailed: 'Error al eliminar el archivo'
    },
    success: {
      deleted: 'Archivo eliminado correctamente'
    },
    warning: {
      notFound: 'No se encontró el archivo',
      notDeleted: 'No se pudo eliminar el archivo',
      notRetrieved: 'No se pudo recuperar el archivo',
      notMatch: 'Tipo de archivo no permitido'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'El id de los archivos es requerido',
      isString: 'El id de los archivos debe ser una cadena de texto',
      isArray: 'El id de los archivos debe ser un arreglo'
    }
  }
}
