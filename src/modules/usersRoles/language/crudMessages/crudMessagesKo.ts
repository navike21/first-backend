import { IMessages } from '../../../../common'

export const crudMessagesKo: IMessages = {
  success: {
    created: '역할이 성공적으로 생성되었습니다',
    updated: '역할이 성공적으로 업데이트되었습니다',
    deleted: '역할이 성공적으로 삭제되었습니다',
    retrieved: '역할이 성공적으로 검색되었습니다',
    list: '역할이 성공적으로 나열되었습니다',
    found: '역할이 발견되었습니다'
  },
  error: {
    creationFailed: '역할 생성에 실패했습니다',
    updateFailed: '역할 업데이트에 실패했습니다',
    deletionFailed: '역할 삭제에 실패했습니다',
    retrievalFailed: '역할 검색에 실패했습니다',
    listFailed: '역할 목록 생성에 실패했습니다',
    searchFailed: '역할 검색에 실패했습니다',
    validationFailed: '유효성 검사 오류',
    duplicate: '역할이 이미 등록되어 있습니다',
    connectionError: '연결 오류',
    databaseError: '데이터베이스 오류',
    unexpectedError: '예상치 못한 오류',
    queryFailed: '쿼리에 실패했습니다'
  },
  warning: {
    notFound: '역할을 찾을 수 없습니다',
    notUpdated: '역할이 업데이트되지 않았습니다',
    notDeleted: '역할이 삭제되지 않았습니다',
    notRetrieved: '역할이 검색되지 않았습니다',
    notListed: '역할을 나열할 수 없습니다',
    notFoundSearch: '역할이 발견되지 않았습니다',
    notMore: '나열할 더 이상의 역할이 없습니다',
    isEmpty: '현재 나열할 역할이 없습니다'
  }
}
