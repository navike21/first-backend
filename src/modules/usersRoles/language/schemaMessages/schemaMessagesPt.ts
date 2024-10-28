import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesPt: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'O nome do papel é obrigatório',
    isString: 'O nome do papel deve ser uma string',
    minLength: 'O nome do papel deve ter pelo menos 2 caracteres',
    maxLength: 'O nome do papel deve ter no máximo 50 caracteres'
  },
  role: {
    isRequired: 'O papel é obrigatório',
    isString: 'O papel deve ser uma string',
    isPattern:
      'O papel só pode conter letras, números, hífens (-) e sublinhados (_), sem espaços',
    minLength: 'O papel deve ter pelo menos 4 caracteres',
    maxLength: 'O papel deve ter no máximo 10 caracteres'
  },
  systemModules: {
    isObject: 'Os módulos do sistema devem ser um objeto',
    isRequired: 'Os módulos do sistema são obrigatórios',
    minLength: 'Deve haver pelo menos um módulo do sistema'
  }
}
