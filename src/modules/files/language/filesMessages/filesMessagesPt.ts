import { TFilesMessage } from '../../types'

export const filesMessagesPt: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Erro ao fazer o upload dos arquivos',
      unexpectedError: 'Erro inesperado',
      deletionFailed: 'Erro ao excluir os arquivos'
    },
    success: {
      completed: 'Arquivos carregados com sucesso',
      list: 'Arquivos listados com sucesso',
      deleted: 'Arquivos excluídos com sucesso'
    },
    warning: {
      notFound: 'Arquivos não encontrados',
      notFoundToDelete: 'Nenhum arquivo encontrado para exclusão',
      notDeleted: 'Os arquivos não puderam ser excluídos',
      notRetrieved: 'Os arquivos não puderam ser recuperados',
      notFoundSearch: 'Nenhum arquivo encontrado com os critérios de pesquisa',
      notMore: 'Não há mais arquivos para exibir'
    }
  },
  file: {
    error: {
      deletionFailed: 'Erro ao excluir o arquivo'
    },
    success: {
      deleted: 'Arquivo excluído com sucesso'
    },
    warning: {
      notFound: 'Arquivo não encontrado',
      notDeleted: 'O arquivo não pôde ser excluído',
      notRetrieved: 'O arquivo não pôde ser recuperado',
      notMatch: 'Tipo de arquivo não permitido'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'O ID do arquivo é obrigatório',
      isString: 'O ID do arquivo deve ser uma string',
      isArray: 'O ID do arquivo deve ser uma matriz'
    }
  }
}
