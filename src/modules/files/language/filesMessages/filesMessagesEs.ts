import { IFilesMessage } from '../../types'

export const filesMessagesEs: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Error al subir el archivo',
      uploadsFailed: 'Error al subir los archivos',
      unexpectedError: 'Error inesperado al subir los archivos',
      deletionFailed: 'Error al eliminar el archivo'
    },
    success: {
      completed: 'Los archivos se subieron correctamente',
      list: 'Lista de archivos obtenida correctamente',
      found: 'Archivo encontrado correctamente',
      retrieved: 'Archivo recuperado correctamente'
    },
    warning: {
      notFound: 'No se encontraron los archivos para subir al servidor',
      notDeleted: 'No se pudieron eliminar los archivos',
      notRetrieved: 'No se pudo recuperar el archivo',
      notFoundSearch:
        'No se encontraron archivos con los criterios de búsqueda',
      notMore: 'No hay más archivos para mostrar',
      notMatch: 'Tipo de archivo no permitido'
    }
  }
}
