import { IMessages } from '../../../../common'

export const crudMessagesPt: IMessages = {
  success: {
    created: 'Função criada com sucesso',
    updated: 'Função atualizada com sucesso',
    deleted: 'Função excluída com sucesso',
    retrieved: 'Função recuperada com sucesso',
    list: 'Funções listadas com sucesso',
    found: 'Função encontrada'
  },
  error: {
    creationFailed: 'Erro ao criar a função',
    updateFailed: 'Erro ao atualizar a função',
    deletionFailed: 'Erro ao excluir a função',
    retrievalFailed: 'Erro ao recuperar a função',
    listFailed: 'Erro ao listar as funções',
    searchFailed: 'Erro ao buscar a função',
    validationFailed: 'Erro de validação',
    duplicate: 'A função já está registrada',
    connectionError: 'Erro de conexão',
    databaseError: 'Erro de banco de dados',
    unexpectedError: 'Erro inesperado',
    queryFailed: 'Erro de consulta'
  },
  warning: {
    notFound: 'A função não foi encontrada',
    notUpdated: 'A função não foi atualizada',
    notDeleted: 'A função não foi excluída',
    notRetrieved: 'A função não foi recuperada',
    notListed: 'Não foi possível listar as funções',
    notFoundSearch: 'A função não foi encontrada',
    notMore: 'Não há mais funções para listar',
    isEmpty: 'Não há funções para listar no momento'
  }
}
