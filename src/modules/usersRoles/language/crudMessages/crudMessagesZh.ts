import { IMessages } from '../../../../common'

export const crudMessagesZh: IMessages = {
  success: {
    created: '角色创建成功',
    updated: '角色更新成功',
    deleted: '角色删除成功',
    retrieved: '角色检索成功',
    list: '角色列出成功',
    found: '找到角色'
  },
  error: {
    creationFailed: '创建角色失败',
    updateFailed: '更新角色失败',
    deletionFailed: '删除角色失败',
    retrievalFailed: '检索角色失败',
    listFailed: '列出角色失败',
    searchFailed: '搜索角色失败',
    validationFailed: '验证错误',
    duplicate: '角色已注册',
    connectionError: '连接错误',
    databaseError: '数据库错误',
    unexpectedError: '意外错误',
    queryFailed: '查询失败'
  },
  warning: {
    notFound: '未找到角色',
    notUpdated: '角色未更新',
    notDeleted: '角色未删除',
    notRetrieved: '角色未检索',
    notListed: '无法列出角色',
    notFoundSearch: '未找到角色',
    notMore: '没有更多角色可列出',
    isEmpty: '目前没有角色可列出'
  }
}
