import { IMessages } from '../../../../common'

export const crudMessagesJp: IMessages = {
  success: {
    created: 'ロールが正常に作成されました',
    updated: 'ロールが正常に更新されました',
    deleted: 'ロールが正常に削除されました',
    retrieved: 'ロールが正常に取得されました',
    list: 'ロールが正常にリストされました',
    found: 'ロールが見つかりました'
  },
  error: {
    creationFailed: 'ロールの作成に失敗しました',
    updateFailed: 'ロールの更新に失敗しました',
    deletionFailed: 'ロールの削除に失敗しました',
    retrievalFailed: 'ロールの取得に失敗しました',
    listFailed: 'ロールのリストに失敗しました',
    searchFailed: 'ロールの検索に失敗しました',
    validationFailed: '検証エラー',
    duplicate: 'ロールはすでに登録されています',
    connectionError: '接続エラー',
    databaseError: 'データベースエラー',
    unexpectedError: '予期しないエラー',
    queryFailed: 'クエリエラー'
  },
  warning: {
    notFound: 'ロールが見つかりませんでした',
    notUpdated: 'ロールが更新されませんでした',
    notDeleted: 'ロールが削除されませんでした',
    notRetrieved: 'ロールが取得されませんでした',
    notListed: 'ロールをリストできませんでした',
    notFoundSearch: 'ロールが見つかりませんでした',
    notMore: 'リストするロールはありません',
    isEmpty: '現在、リストするロールはありません'
  }
}
