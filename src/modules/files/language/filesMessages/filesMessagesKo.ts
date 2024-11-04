import { TFilesMessage } from '../../types'

export const filesMessagesKo: TFilesMessage = {
  files: {
    error: {
      uploadFailed: '파일 업로드 실패',
      unexpectedError: '예기치 않은 오류',
      deletionFailed: '파일 삭제 실패'
    },
    success: {
      completed: '파일이 성공적으로 업로드되었습니다',
      list: '파일이 성공적으로 목록화되었습니다',
      deleted: '파일이 성공적으로 삭제되었습니다'
    },
    warning: {
      notFound: '파일을 찾을 수 없습니다',
      notFoundToDelete: '삭제할 파일을 찾을 수 없습니다',
      notDeleted: '파일을 삭제할 수 없습니다',
      notRetrieved: '파일을 검색할 수 없습니다',
      notFoundSearch: '검색 기준에 맞는 파일이 없습니다',
      notMore: '더 이상 표시할 파일이 없습니다'
    }
  },
  file: {
    error: {
      deletionFailed: '파일 삭제 실패'
    },
    success: {
      deleted: '파일이 성공적으로 삭제되었습니다'
    },
    warning: {
      notFound: '파일을 찾을 수 없습니다',
      notDeleted: '파일을 삭제할 수 없습니다',
      notRetrieved: '파일을 검색할 수 없습니다',
      notMatch: '허용되지 않는 파일 유형입니다'
    }
  },
  validation: {
    idFiles: {
      isRequired: '파일 ID가 필요합니다',
      isString: '파일 ID는 문자열이어야 합니다',
      isArray: '파일 ID는 배열이어야 합니다'
    }
  }
}
