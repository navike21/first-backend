import { IMessages } from '../../../../common'

export const userCrudKo: IMessages = {
  success: {
    created: '사용자가 성공적으로 생성되었습니다',
    updated: '사용자가 성공적으로 업데이트되었습니다',
    deleted: '사용자가 성공적으로 삭제되었습니다',
    retrieved: '사용자가 성공적으로 검색되었습니다',
    list: '사용자가 성공적으로 나열되었습니다',
    found: '사용자가 발견되었습니다'
  },
  error: {
    creationFailed: '사용자 생성 실패',
    updateFailed: '사용자 업데이트 실패',
    deletionFailed: '사용자 삭제 실패',
    retrievalFailed: '사용자 검색 실패',
    listFailed: '사용자 나열 실패',
    searchFailed: '사용자 검색 실패',
    validationFailed: '유효성 검사 오류',
    duplicate: '사용자가 이미 등록되었습니다',
    connectionError: '연결 오류',
    databaseError: '데이터베이스 오류',
    unexpectedError: '예기치 않은 오류',
    queryFailed: '쿼리 오류'
  },
  warning: {
    notFound: '사용자를 찾을 수 없습니다',
    notUpdated: '사용자가 업데이트되지 않았습니다',
    notDeleted: '사용자가 삭제되지 않았습니다',
    notRetrieved: '사용자가 검색되지 않았습니다',
    notListed: '사용자를 나열할 수 없습니다',
    notFoundSearch: '검색에서 사용자를 찾을 수 없습니다',
    notMore: '더 이상 나열할 사용자가 없습니다',
    isEmpty: '이 시점에 나열할 사용자가 없습니다'
  }
}
