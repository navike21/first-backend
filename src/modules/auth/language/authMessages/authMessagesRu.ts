import { TUserAuthMessage } from '../../types'

export const authMessagesRu: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Пароль успешно обновлён',
      created: 'Пароль успешно создан',
      retrieved: 'Пароль успешно восстановлен'
    },
    error: {
      updateFailed: 'Ошибка обновления пароля',
      creationFailed: 'Ошибка создания пароля',
      retrievalFailed: 'Ошибка восстановления пароля',
      validationFailed: 'Ошибка проверки',
      unexpectedError: 'Неожиданная ошибка'
    },
    warning: {
      notMatch: 'Пароли не совпадают',
      isEmpty: 'Пароль не может быть пустым'
    },
    validation: {
      isString: 'Пароль должен быть строкой',
      isRequired: 'Пароль обязателен'
    }
  }
}
