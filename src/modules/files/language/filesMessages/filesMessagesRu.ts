import { IFilesMessage } from '../../types'

export const filesMessagesRu: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Ошибка загрузки файла',
      uploadsFailed: 'Ошибка загрузки файлов',
      unexpectedError: 'Неожиданная ошибка при загрузке файлов',
      deletionFailed: 'Ошибка удаления файла'
    },
    success: {
      completed: 'Файлы успешно загружены',
      list: 'Список файлов успешно получен',
      found: 'Файл успешно найден',
      retrieved: 'Файл успешно получен'
    },
    warning: {
      notFound: 'Файлы для загрузки на сервер не найдены',
      notDeleted: 'Не удалось удалить файлы',
      notRetrieved: 'Не удалось получить файл',
      notFoundSearch: 'Файлы по заданным критериям поиска не найдены',
      notMore: 'Больше файлов для отображения нет',
      notMatch: 'Недопустимый тип файла'
    }
  }
}
