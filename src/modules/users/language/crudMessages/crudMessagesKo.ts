import { IMessages } from '../../../../common'

export const crudMessagesKo: IMessages = {
  success: {
    created: '사용자가 성공적으로 생성되었습니다',
    updated: '사용자가 성공적으로 업데이트되었습니다',
    deleted: '사용자가 성공적으로 삭제되었습니다',
    retrieved: '사용자가 성공적으로 검색되었습니다',
    list: '사용자가 성공적으로 나열되었습니다',
    found: '사용자를 찾았습니다'
  },
  error: {
    creationFailed: '사용자 생성 중 오류',
    updateFailed: '사용자 업데이트 중 오류',
    deletionFailed: '사용자 삭제 중 오류',
    retrievalFailed: '사용자 검색 중 오류',
    listFailed: '사용자 목록 표시 중 오류',
    searchFailed: '사용자 검색 오류',
    validationFailed: '검증 오류',
    duplicate: '사용자가 이미 등록되어 있습니다',
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
    isEmpty: '현재 나열할 사용자가 없습니다'
  }
}
