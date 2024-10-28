import { IMessages } from '../../../../common'

export const crudMessagesJp: IMessages = {
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
    duplicate: 'ユーザーはすでに登録されています',
    connectionError: '接続エラー',
    databaseError: 'データベースエラー',
    unexpectedError: '予期しないエラー',
    queryFailed: 'クエリエラー'
  },
  warning: {
    notFound: 'ユーザーが見つかりません',
    notUpdated: 'ユーザーは更新されていません',
    notDeleted: 'ユーザーは削除されていません',
    notRetrieved: 'ユーザーは取得されていません',
    notListed: 'ユーザーを一覧表示できませんでした',
    notFoundSearch: '検索でユーザーが見つかりませんでした',
    notMore: 'これ以上のユーザーはありません',
    isEmpty: '現在、一覧表示できるユーザーがいません'
  }
}
