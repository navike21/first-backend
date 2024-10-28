import { IMessages } from '../../../../common'

export const crudMessagesRu: IMessages = {
  success: {
    created: 'Роль успешно создана',
    updated: 'Роль успешно обновлена',
    deleted: 'Роль успешно удалена',
    retrieved: 'Роль успешно извлечена',
    list: 'Роли успешно перечислены',
    found: 'Роль найдена'
  },
  error: {
    creationFailed: 'Ошибка при создании роли',
    updateFailed: 'Ошибка при обновлении роли',
    deletionFailed: 'Ошибка при удалении роли',
    retrievalFailed: 'Ошибка при извлечении роли',
    listFailed: 'Ошибка при перечислении ролей',
    searchFailed: 'Ошибка при поиске роли',
    validationFailed: 'Ошибка валидации',
    duplicate: 'Роль уже зарегистрирована',
    connectionError: 'Ошибка соединения',
    databaseError: 'Ошибка базы данных',
    unexpectedError: 'Неожиданная ошибка',
    queryFailed: 'Ошибка запроса'
  },
  warning: {
    notFound: 'Роль не найдена',
    notUpdated: 'Роль не обновлена',
    notDeleted: 'Роль не удалена',
    notRetrieved: 'Роль не извлечена',
    notListed: 'Не удалось перечислить роли',
    notFoundSearch: 'Роль не найдена',
    notMore: 'Нет больше ролей для перечисления',
    isEmpty: 'На данный момент нет ролей для перечисления'
  }
}
