import { TFilesMessage } from '../../types'

export const filesMessagesZh: TFilesMessage = {
  files: {
    error: {
      uploadFailed: '文件上传失败',
      unexpectedError: '意外错误',
      deletionFailed: '删除文件失败'
    },
    success: {
      completed: '文件上传成功',
      list: '文件列表成功',
      deleted: '文件已成功删除'
    },
    warning: {
      notFound: '未找到文件',
      notFoundToDelete: '未找到要删除的文件',
      notDeleted: '无法删除文件',
      notRetrieved: '无法检索文件',
      notFoundSearch: '未找到符合搜索条件的文件',
      notMore: '没有更多文件可显示'
    }
  },
  file: {
    error: {
      deletionFailed: '删除文件失败'
    },
    success: {
      deleted: '文件已成功删除'
    },
    warning: {
      notFound: '未找到文件',
      notDeleted: '无法删除文件',
      notRetrieved: '无法检索文件',
      notMatch: '不允许的文件类型'
    }
  },
  validation: {
    idFiles: {
      isRequired: '文件 ID 是必需的',
      isString: '文件 ID 必须是字符串',
      isArray: '文件 ID 必须是数组'
    }
  }
}
