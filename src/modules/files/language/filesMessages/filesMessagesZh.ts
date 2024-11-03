import { IFilesMessage } from '../../types'

export const filesMessagesZh: IFilesMessage = {
  files: {
    error: {
      uploadFailed: '文件上传失败',
      uploadsFailed: '文件上传失败',
      unexpectedError: '文件上传时发生意外错误',
      deletionFailed: '删除文件失败'
    },
    success: {
      completed: '文件上传成功',
      list: '文件列表获取成功',
      found: '文件找到成功',
      retrieved: '文件检索成功'
    },
    warning: {
      notFound: '未找到要上传到服务器的文件',
      notDeleted: '无法删除文件',
      notRetrieved: '无法检索文件',
      notFoundSearch: '未找到符合搜索条件的文件',
      notMore: '没有更多文件可显示',
      notMatch: '文件类型不允许'
    }
  }
}
