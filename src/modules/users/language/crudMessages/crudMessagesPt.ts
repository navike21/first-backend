import { IMessages } from '../../../../common'

export const crudMessagesPt: IMessages = {
  success: {
    created: 'Usuário criado com sucesso',
    updated: 'Usuário atualizado com sucesso',
    deleted: 'Usuário excluído com sucesso',
    retrieved: 'Usuário recuperado com sucesso',
    list: 'Usuários listados com sucesso',
    found: 'Usuário encontrado'
  },
  error: {
    creationFailed: 'Erro ao criar usuário',
    updateFailed: 'Erro ao atualizar usuário',
    deletionFailed: 'Erro ao excluir usuário',
    retrievalFailed: 'Erro ao recuperar usuário',
    listFailed: 'Erro ao listar usuários',
    searchFailed: 'Erro ao buscar usuário',
    validationFailed: 'Erro de validação',
    duplicate: 'Usuário já registrado',
    connectionError: 'Erro de conexão',
    databaseError: 'Erro de banco de dados',
    unexpectedError: 'Erro inesperado',
    queryFailed: 'Erro de consulta'
  },
  warning: {
    notFound: 'Usuário não encontrado',
    notUpdated: 'Usuário não atualizado',
    notDeleted: 'Usuário não excluído',
    notRetrieved: 'Usuário não recuperado',
    notListed: 'Usuários não puderam ser listados',
    notFoundSearch: 'Usuário não encontrado na busca',
    notMore: 'Não há mais usuários para listar',
    isEmpty: 'Não há usuários para listar no momento'
  }
}
