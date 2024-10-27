import { TUserSchemaMessage } from '../../types'

export const schemaMessagesPt: TUserSchemaMessage = {
  documentId: {
    isString: 'O documento de identidade deve ser uma string',
    minLength: 'O documento de identidade deve ter pelo menos 8 caracteres',
    maxLength: 'O documento de identidade deve ter no máximo 8 caracteres',
    isRequired: 'O documento de identidade é obrigatório'
  },
  email: {
    isString: 'O e-mail deve ser uma string',
    isEmail: 'O e-mail deve ser válido',
    isRequired: 'O e-mail é obrigatório'
  },
  fatherLastName: {
    isString: 'O sobrenome do pai deve ser uma string',
    minLength: 'O sobrenome do pai deve ter pelo menos 2 caracteres',
    maxLength: 'O sobrenome do pai deve ter no máximo 50 caracteres',
    isRequired: 'O sobrenome do pai é obrigatório'
  },
  image: {
    isString: 'A URL da imagem deve ser uma string',
    isUrl: 'A URL da imagem deve ser válida'
  },
  motherLastName: {
    isString: 'O sobrenome da mãe deve ser uma string',
    minLength: 'O sobrenome da mãe deve ter pelo menos 2 caracteres',
    maxLength: 'O sobrenome da mãe deve ter no máximo 50 caracteres',
    isRequired: 'O sobrenome da mãe é obrigatório'
  },
  names: {
    isString: 'O nome deve ser uma string',
    minLength: 'O nome deve ter pelo menos 2 caracteres',
    maxLength: 'O nome deve ter no máximo 50 caracteres',
    isRequired: 'O nome é obrigatório'
  },
  phone: {
    isString: 'O telefone deve ser uma string',
    minLength: 'O telefone deve ter pelo menos 7 caracteres',
    maxLength: 'O telefone deve ter no máximo 15 caracteres'
  },
  dateOfBirth: {
    isDate: 'A data de nascimento deve ser uma data'
  }
}
