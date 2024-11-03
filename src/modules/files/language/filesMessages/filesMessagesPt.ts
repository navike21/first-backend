import { IFilesMessage } from '../../types'

export const filesMessagesPt: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Erro ao enviar o arquivo',
      uploadsFailed: 'Erro ao enviar os arquivos',
      unexpectedError: 'Erro inesperado ao enviar os arquivos',
      deletionFailed: 'Erro ao excluir o arquivo'
    },
    success: {
      completed: 'Arquivos carregados com sucesso',
      list: 'Lista de arquivos obtida com sucesso',
      found: 'Arquivo encontrado com sucesso',
      retrieved: 'Arquivo recuperado com sucesso'
    },
    warning: {
      notFound: 'Nenhum arquivo encontrado para enviar ao servidor',
      notDeleted: 'Não foi possível excluir os arquivos',
      notRetrieved: 'Não foi possível recuperar o arquivo',
      notFoundSearch: 'Nenhum arquivo encontrado com os critérios de pesquisa',
      notMore: 'Não há mais arquivos para mostrar',
      notMatch: 'Tipo de arquivo não permitido'
    }
  }
}
