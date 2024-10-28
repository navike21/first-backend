import { IMessages } from '../../../../common'

export const crudMessagesRu: IMessages = {
  success: {
    created: 'Пользователь успешно создан',
    updated: 'Пользователь успешно обновлен',
    deleted: 'Пользователь успешно удален',
    retrieved: 'Пользователь успешно получен',
    list: 'Пользователи успешно перечислены',
    found: 'Пользователь найден'
  },
  error: {
    creationFailed: 'Ошибка при создании пользователя',
    updateFailed: 'Ошибка при обновлении пользователя',
    deletionFailed: 'Ошибка при удалении пользователя',
    retrievalFailed: 'Ошибка при получении пользователя',
    listFailed: 'Ошибка при перечислении пользователей',
    searchFailed: 'Ошибка при поиске пользователя',
    validationFailed: 'Ошибка проверки',
    duplicate: 'Пользователь уже зарегистрирован',
    connectionError: 'Ошибка подключения',
    databaseError: 'Ошибка базы данных',
    unexpectedError: 'Неожиданная ошибка',
    queryFailed: 'Ошибка запроса'
  },
  warning: {
    notFound: 'Пользователь не найден',
    notUpdated: 'Пользователь не обновлен',
    notDeleted: 'Пользователь не удален',
    notRetrieved: 'Пользователь не получен',
    notListed: 'Не удалось перечислить пользователей',
    notFoundSearch: 'Пользователь не найден в поиске',
    notMore: 'Больше нет пользователей для перечисления',
    isEmpty: 'В данный момент нет пользователей для перечисления'
  }
}
