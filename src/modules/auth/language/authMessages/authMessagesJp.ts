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
  },
  login: {
    success: {
      completed: 'ログイン成功'
    },
    error: {
      validationFailed: 'ログイン中の検証エラー',
      unexpectedError: 'ログイン中に予期しないエラーが発生しました'
    },
    warning: {
      notMatch: 'パスワードが間違っています',
      isBlocked: 'ユーザーはブロックされています',
      notFound: 'ユーザーが登録されていません'
    },
    email: {
      isEmail: 'メールは有効なメールアドレスである必要があります',
      isRequired: 'メールは必須です',
      isString: 'メールは文字列である必要があります'
    },
    password: {
      isString: 'パスワードは文字列である必要があります',
      isRequired: 'パスワードは必須です',
      minLength: 'パスワードは少なくとも6文字である必要があります',
      isMissing: 'パスワードは登録されていません'
    }
  },
  session: {
    token: {
      isString: 'トークンは文字列である必要があります',
      isRequired: 'トークンは必須です',
      isMissing: 'トークンが見つかりません',
      isMatch: 'トークンが無効です'
    },
    validation: {
      success: {
        completed: 'セッションが正常に検証されました'
      },
      error: {
        validationFailed: 'セッション検証エラー',
        unexpectedError: 'セッション検証中に予期しないエラーが発生しました'
      },
      warning: {
        notMatch: '無効なセッションです',
        isExpired: 'セッショントークンが期限切れです'
      }
    }
  }
}
