import { IMessages } from '../../../../common'

export const userCrudPt: IMessages = {
  success: {
    created: 'Usuário criado com sucesso',
    updated: 'Usuário atualizado com sucesso',
    deleted: 'Usuário deletado com sucesso',
    retrieved: 'Usuário recuperado com sucesso',
    list: 'Usuários listados com sucesso',
    found: 'Usuário encontrado'
  },
  error: {
    creationFailed: 'Falha ao criar usuário',
    updateFailed: 'Falha ao atualizar usuário',
    deletionFailed: 'Falha ao deletar usuário',
    retrievalFailed: 'Falha ao recuperar usuário',
    listFailed: 'Falha ao listar usuários',
    searchFailed: 'Falha ao procurar usuário',
    validationFailed: 'Erro de validação',
    duplicate: 'Usuário já está registrado',
    connectionError: 'Erro de conexão',
    databaseError: 'Erro de banco de dados',
    unexpectedError: 'Erro inesperado',
    queryFailed: 'Erro de consulta'
  },
  warning: {
    notFound: 'Usuário não encontrado',
    notUpdated: 'Usuário não atualizado',
    notDeleted: 'Usuário não deletado',
    notRetrieved: 'Usuário não recuperado',
    notListed: 'Usuários não puderam ser listados',
    notFoundSearch: 'Usuário não encontrado na pesquisa',
    notMore: 'Não há mais usuários para listar'
  }
}
