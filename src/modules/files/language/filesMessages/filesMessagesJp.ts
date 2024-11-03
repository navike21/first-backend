import { IFilesMessage } from '../../types'

export const filesMessagesJp: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'ファイルのアップロードに失敗しました',
      uploadsFailed: 'ファイルのアップロードに失敗しました',
      unexpectedError:
        'ファイルのアップロード中に予期しないエラーが発生しました',
      deletionFailed: 'ファイルの削除エラー'
    },
    success: {
      completed: 'ファイルが正常にアップロードされました',
      list: 'ファイルリストの取得に成功しました',
      found: 'ファイルが正常に見つかりました',
      retrieved: 'ファイルが正常に取得されました'
    },
    warning: {
      notFound: 'サーバーにアップロードするファイルが見つかりません',
      notDeleted: 'ファイルを削除できませんでした',
      notRetrieved: 'ファイルを取得できませんでした',
      notFoundSearch: '検索条件に一致するファイルは見つかりませんでした',
      notMore: '表示するファイルがありません',
      notMatch: '許可されていないファイルタイプ'
    }
  }
}
