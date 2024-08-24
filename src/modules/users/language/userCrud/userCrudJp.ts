import { IMessages } from '../../../../common'

export const userCrudJp: IMessages = {
  success: {
    created: 'ユーザーが正常に作成されました',
    updated: 'ユーザーが正常に更新されました',
    deleted: 'ユーザーが正常に削除されました',
    retrieved: 'ユーザーが正常に取得されました',
    list: 'ユーザーが正常に一覧表示されました',
    found: 'ユーザーが見つかりました'
  },
  error: {
    creationFailed: 'ユーザーの作成に失敗しました',
    updateFailed: 'ユーザーの更新に失敗しました',
    deletionFailed: 'ユーザーの削除に失敗しました',
    retrievalFailed: 'ユーザーの取得に失敗しました',
    listFailed: 'ユーザーの一覧表示に失敗しました',
    searchFailed: 'ユーザーの検索に失敗しました',
    validationFailed: '検証エラー',
    duplicate: 'ユーザーは既に登録されています',
    connectionError: '接続エラー',
    databaseError: 'データベースエラー',
    unexpectedError: '予期しないエラー',
    queryFailed: 'クエリエラー'
  },
  warning: {
    notFound: 'ユーザーが見つかりません',
    notUpdated: 'ユーザーが更新されませんでした',
    notDeleted: 'ユーザーが削除されませんでした',
    notRetrieved: 'ユーザーが取得されませんでした',
    notListed: 'ユーザーを一覧表示できませんでした',
    notFoundSearch: '検索でユーザーが見つかりませんでした',
    notMore: 'リストするユーザーがもうありません',
    isEmpty: 'この時点でリストするユーザーはありません'
  }
}
