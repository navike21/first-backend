import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesRu: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Имя роли обязательно',
    isString: 'Имя роли должно быть строкой',
    minLength: 'Имя роли должно содержать не менее 2 символов',
    maxLength: 'Имя роли должно содержать не более 50 символов'
  },
  role: {
    isRequired: 'Роль обязательна',
    isString: 'Роль должна быть строкой',
    isPattern:
      'Роль может содержать только буквы, цифры, дефисы (-) и подчеркивания (_), без пробелов',
    minLength: 'Роль должна содержать не менее 4 символов',
    maxLength: 'Роль должна содержать не более 10 символов'
  },
  systemModules: {
    isObject: 'Системные модули должны быть объектом',
    isRequired: 'Системные модули обязательны',
    minLength: 'Должен быть хотя бы один системный модуль'
  }
}
