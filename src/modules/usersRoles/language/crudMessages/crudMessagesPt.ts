import { IMessages } from '../../../../common'

export const crudMessagesPt: IMessages = {
  success: {
    created: 'Cargo criado com sucesso',
    updated: 'Cargo atualizado com sucesso',
    deleted: 'Cargo excluído com sucesso',
    retrieved: 'Cargo recuperado com sucesso',
    list: 'Cargos listados com sucesso',
    found: 'Cargo encontrado'
  },
  error: {
    creationFailed: 'Falha ao criar o cargo',
    updateFailed: 'Falha ao atualizar o cargo',
    deletionFailed: 'Falha ao excluir o cargo',
    retrievalFailed: 'Falha ao recuperar o cargo',
    listFailed: 'Falha ao listar os cargos',
    searchFailed: 'Falha ao buscar o cargo',
    validationFailed: 'Erro de validação',
    duplicate: 'O cargo já está registrado',
    connectionError: 'Erro de conexão',
    databaseError: 'Erro de banco de dados',
    unexpectedError: 'Erro inesperado',
    queryFailed: 'Falha na consulta'
  },
  warning: {
    notFound: 'Cargo não encontrado',
    notUpdated: 'Cargo não atualizado',
    notDeleted: 'Cargo não excluído',
    notRetrieved: 'Cargo não recuperado',
    notListed: 'Não foi possível listar os cargos',
    notFoundSearch: 'Cargo não encontrado',
    notMore: 'Não há mais cargos para listar',
    isEmpty: 'Não há cargos para listar no momento'
  }
}
