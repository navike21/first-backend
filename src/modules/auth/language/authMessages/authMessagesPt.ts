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
  },
  login: {
    success: {
      completed: 'Login bem-sucedido'
    },
    error: {
      validationFailed: 'Erro de validação no login',
      unexpectedError: 'Erro inesperado no login'
    },
    warning: {
      notMatch: 'Senha incorreta',
      isBlocked: 'O usuário está bloqueado',
      notFound: 'Usuário não registrado'
    },
    email: {
      isEmail: 'O e-mail deve ser um e-mail válido',
      isRequired: 'O e-mail é obrigatório',
      isString: 'O e-mail deve ser uma string'
    },
    password: {
      isString: 'A senha deve ser uma string',
      isRequired: 'A senha é obrigatória',
      minLength: 'A senha deve ter pelo menos 6 caracteres',
      isMissing: 'A senha não está registrada'
    }
  },
  session: {
    token: {
      isString: 'O token deve ser uma string',
      isRequired: 'O token é obrigatório',
      isMissing: 'Token não encontrado',
      isMatch: 'O token não é válido'
    },
    validation: {
      success: {
        completed: 'Sessão validada com sucesso'
      },
      error: {
        validationFailed: 'Erro de validação da sessão',
        unexpectedError: 'Erro inesperado na validação da sessão'
      },
      warning: {
        notMatch: 'Sessão inválida',
        isExpired: 'O token da sessão expirou'
      }
    }
  }
}
