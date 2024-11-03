import { IFilesMessage } from '../../types'

export const filesMessagesKo: IFilesMessage = {
  files: {
    error: {
      uploadFailed: '파일 업로드 실패',
      uploadsFailed: '파일 업로드 실패',
      unexpectedError: '파일 업로드 중 예상치 못한 오류 발생',
      deletionFailed: '파일 삭제 오류'
    },
    success: {
      completed: '파일이 성공적으로 업로드되었습니다',
      list: '파일 목록을 성공적으로 가져왔습니다',
      found: '파일이 성공적으로 발견되었습니다',
      retrieved: '파일이 성공적으로 검색되었습니다'
    },
    warning: {
      notFound: '서버에 업로드할 파일을 찾을 수 없습니다',
      notDeleted: '파일을 삭제할 수 없습니다',
      notRetrieved: '파일을 검색할 수 없습니다',
      notFoundSearch: '검색 조건에 맞는 파일이 없습니다',
      notMore: '표시할 파일이 더 이상 없습니다',
      notMatch: '허용되지 않는 파일 형식'
    }
  }
}
