import { IMessages } from '../../../../common'

export const updatePasswordMessagesJp: IMessages = {
  success: {
    updated: 'パスワードが正常に更新されました'
  },
  warning: {
    notUpdated: 'パスワードを更新できませんでした',
    notMatch: 'パスワードが一致しません'
  },
  error: {
    updateFailed: 'パスワードの更新に失敗しました',
    unexpectedError: '予期しないエラーが発生しました'
  }
}
