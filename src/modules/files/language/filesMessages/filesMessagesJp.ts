import { TFilesMessage } from '../../types'

export const filesMessagesJp: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'ファイルのアップロード中にエラーが発生しました',
      unexpectedError: '予期しないエラー',
      deletionFailed: 'ファイルの削除中にエラーが発生しました'
    },
    success: {
      completed: 'ファイルが正常にアップロードされました',
      list: 'ファイルが正常に一覧表示されました',
      deleted: 'ファイルが正常に削除されました'
    },
    warning: {
      notFound: 'ファイルが見つかりません',
      notFoundToDelete: '削除するファイルが見つかりません',
      notDeleted: 'ファイルを削除できませんでした',
      notRetrieved: 'ファイルを取得できませんでした',
      notFoundSearch: '検索条件に一致するファイルが見つかりません',
      notMore: '表示するファイルがもうありません'
    }
  },
  file: {
    error: {
      deletionFailed: 'ファイルの削除中にエラーが発生しました'
    },
    success: {
      deleted: 'ファイルが正常に削除されました'
    },
    warning: {
      notFound: 'ファイルが見つかりません',
      notDeleted: 'ファイルを削除できませんでした',
      notRetrieved: 'ファイルを取得できませんでした',
      notMatch: '許可されていないファイル形式です'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'ファイルIDが必要です',
      isString: 'ファイルIDは文字列でなければなりません',
      isArray: 'ファイルIDは配列でなければなりません'
    }
  }
}
