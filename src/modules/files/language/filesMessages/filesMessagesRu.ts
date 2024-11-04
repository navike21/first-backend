import { TFilesMessage } from '../../types'

export const filesMessagesRu: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Ошибка при загрузке файлов',
      unexpectedError: 'Неожиданная ошибка',
      deletionFailed: 'Ошибка при удалении файлов'
    },
    success: {
      completed: 'Файлы успешно загружены',
      list: 'Список файлов успешно получен',
      deleted: 'Файлы успешно удалены'
    },
    warning: {
      notFound: 'Файлы не найдены',
      notFoundToDelete: 'Не найдены файлы для удаления',
      notDeleted: 'Не удалось удалить файлы',
      notRetrieved: 'Не удалось получить файлы',
      notFoundSearch: 'Файлы не найдены по заданным критериям поиска',
      notMore: 'Больше нет файлов для отображения'
    }
  },
  file: {
    error: {
      deletionFailed: 'Ошибка при удалении файла'
    },
    success: {
      deleted: 'Файл успешно удалён'
    },
    warning: {
      notFound: 'Файл не найден',
      notDeleted: 'Не удалось удалить файл',
      notRetrieved: 'Не удалось получить файл',
      notMatch: 'Недопустимый тип файла'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'ID файла обязателен',
      isString: 'ID файла должен быть строкой',
      isArray: 'ID файла должен быть массивом'
    }
  }
}
