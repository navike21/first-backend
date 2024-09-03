import { IMessages } from '../../../../common'

export const updatePasswordMessagesPt: IMessages = {
  success: {
    updated: 'Senha atualizada com sucesso'
  },
  warning: {
    notUpdated: 'Não foi possível atualizar a senha',
    notMatch: 'Senhas não coincidem'
  },
  error: {
    updateFailed: 'Falha ao atualizar a senha',
    unexpectedError: 'Erro inesperado'
  }
}
