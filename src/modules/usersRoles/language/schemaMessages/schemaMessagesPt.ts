import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesPt: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'O nome da função é obrigatório',
    isString: 'O nome da função deve ser uma string',
    minLength: 'O nome da função deve ter pelo menos 2 caracteres',
    maxLength: 'O nome da função deve ter no máximo 50 caracteres'
  },
  role: {
    isRequired: 'O papel é obrigatório',
    isString: 'O papel deve ser uma string',
    isPattern:
      'O papel só pode conter letras, números, hífens (-) e sublinhados (_), sem espaços',
    minLength: 'O papel deve ter no mínimo 4 caracteres',
    maxLength: 'O papel deve ter no máximo 10 caracteres'
  },
  systemModules: {
    isObject: 'Os módulos do sistema devem ser um objeto',
    isRequired: 'Os módulos do sistema são obrigatórios',
    minLength: 'Pelo menos um módulo do sistema é obrigatório'
  }
}
