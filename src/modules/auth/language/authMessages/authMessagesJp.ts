import { TUserAuthMessage } from '../../types'

export const authMessagesJp: TUserAuthMessage = {
  password: {
    success: {
      updated: 'パスワードが正常に更新されました',
      created: 'パスワードが正常に作成されました',
      retrieved: 'パスワードが正常に取得されました'
    },
    error: {
      updateFailed: 'パスワードの更新に失敗しました',
      creationFailed: 'パスワードの作成に失敗しました',
      retrievalFailed: 'パスワードの取得に失敗しました',
      validationFailed: '検証エラー',
      unexpectedError: '予期しないエラー'
    },
    warning: {
      notMatch: 'パスワードが一致しません',
      isEmpty: 'パスワードを空にすることはできません'
    },
    validation: {
      isString: 'パスワードは文字列である必要があります',
      isRequired: 'パスワードは必須です'
    }
  }
}
