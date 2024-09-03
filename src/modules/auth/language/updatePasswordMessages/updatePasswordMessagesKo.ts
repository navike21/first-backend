import { IMessages } from '../../../../common'

export const updatePasswordMessagesKo: IMessages = {
  success: {
    updated: '비밀번호가 성공적으로 업데이트되었습니다'
  },
  warning: {
    notUpdated: '비밀번호를 업데이트할 수 없습니다',
    notMatch: '비밀번호가 일치하지 않습니다'
  },
  error: {
    updateFailed: '비밀번호 업데이트에 실패했습니다',
    unexpectedError: '예상치 못한 오류가 발생했습니다'
  }
}
