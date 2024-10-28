import { TUserAuthMessage } from '../../types'

export const authMessagesKo: TUserAuthMessage = {
  password: {
    success: {
      updated: '비밀번호가 성공적으로 업데이트되었습니다',
      created: '비밀번호가 성공적으로 생성되었습니다',
      retrieved: '비밀번호가 성공적으로 검색되었습니다'
    },
    error: {
      updateFailed: '비밀번호 업데이트 실패',
      creationFailed: '비밀번호 생성 실패',
      retrievalFailed: '비밀번호 검색 실패',
      validationFailed: '유효성 검사 오류',
      unexpectedError: '예기치 않은 오류'
    },
    warning: {
      notMatch: '비밀번호가 일치하지 않습니다',
      isEmpty: '비밀번호는 비워둘 수 없습니다'
    },
    validation: {
      isString: '비밀번호는 문자열이어야 합니다',
      isRequired: '비밀번호는 필수입니다'
    }
  }
}
