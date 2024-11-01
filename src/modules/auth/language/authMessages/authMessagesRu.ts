import { TUserAuthMessage } from '../../types'

export const authMessagesRu: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Пароль успешно обновлен',
      created: 'Пароль успешно создан',
      retrieved: 'Пароль успешно восстановлен'
    },
    error: {
      updateFailed: 'Ошибка при обновлении пароля',
      creationFailed: 'Ошибка при создании пароля',
      retrievalFailed: 'Ошибка при восстановлении пароля',
      validationFailed: 'Ошибка валидации',
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
  },
  login: {
    success: {
      completed: 'Успешный вход в систему'
    },
    error: {
      validationFailed: 'Ошибка валидации при входе',
      unexpectedError: 'Неожиданная ошибка при входе'
    },
    warning: {
      notMatch: 'Неверный пароль',
      isBlocked: 'Пользователь заблокирован',
      notFound: 'Пользователь не зарегистрирован'
    },
    email: {
      isEmail: 'Электронная почта должна быть действительной',
      isRequired: 'Электронная почта обязательна',
      isString: 'Электронная почта должна быть строкой'
    },
    password: {
      isString: 'Пароль должен быть строкой',
      isRequired: 'Пароль обязателен',
      minLength: 'Пароль должен содержать не менее 6 символов',
      isMissing: 'Пароль не зарегистрирован'
    }
  },
  session: {
    token: {
      isString: 'Токен должен быть строкой',
      isRequired: 'Токен обязателен',
      isMissing: 'Токен не найден',
      isMatch: 'Токен недействителен'
    },
    validation: {
      success: {
        completed: 'Сессия успешно подтверждена'
      },
      error: {
        validationFailed: 'Ошибка валидации сессии',
        unexpectedError: 'Неожиданная ошибка при проверке сессии'
      },
      warning: {
        notMatch: 'Недействительная сессия',
        isExpired: 'Токен сессии истек'
      }
    }
  }
}
