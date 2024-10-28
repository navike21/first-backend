import { IMessages } from '../../../../common'

export const crudMessagesJp: IMessages = {
  success: {
    created: 'ロールが正常に作成されました',
    updated: 'ロールが正常に更新されました',
    deleted: 'ロールが正常に削除されました',
    retrieved: 'ロールが正常に取得されました',
    list: 'ロールが正常に一覧表示されました',
    found: 'ロールが見つかりました'
  },
  error: {
    creationFailed: 'ロールの作成に失敗しました',
    updateFailed: 'ロールの更新に失敗しました',
    deletionFailed: 'ロールの削除に失敗しました',
    retrievalFailed: 'ロールの取得に失敗しました',
    listFailed: 'ロールの一覧表示に失敗しました',
    searchFailed: 'ロールの検索に失敗しました',
    validationFailed: '検証エラー',
    duplicate: 'ロールはすでに登録されています',
    connectionError: '接続エラー',
    databaseError: 'データベースエラー',
    unexpectedError: '予期しないエラー',
    queryFailed: 'クエリに失敗しました'
  },
  warning: {
    notFound: 'ロールが見つかりませんでした',
    notUpdated: 'ロールは更新されませんでした',
    notDeleted: 'ロールは削除されませんでした',
    notRetrieved: 'ロールは取得されませんでした',
    notListed: 'ロールを一覧表示できませんでした',
    notFoundSearch: 'ロールが見つかりませんでした',
    notMore: 'これ以上のロールはありません',
    isEmpty: '現在、表示するロールはありません'
  }
}
