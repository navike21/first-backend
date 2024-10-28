import { TUserAuthMessage } from '../../types'

export const authMessagesPt: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Senha atualizada com sucesso',
      created: 'Senha criada com sucesso',
      retrieved: 'Senha recuperada com sucesso'
    },
    error: {
      updateFailed: 'Erro ao atualizar a senha',
      creationFailed: 'Erro ao criar a senha',
      retrievalFailed: 'Erro ao recuperar a senha',
      validationFailed: 'Erro de validação',
      unexpectedError: 'Erro inesperado'
    },
    warning: {
      notMatch: 'As senhas não coincidem',
      isEmpty: 'A senha não pode estar vazia'
    },
    validation: {
      isString: 'A senha deve ser uma string',
      isRequired: 'A senha é obrigatória'
    }
  }
}
