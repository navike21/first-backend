import { IMessages } from '../../../../common'

export const crudMessagesZh: IMessages = {
  success: {
    created: '用户创建成功',
    updated: '用户更新成功',
    deleted: '用户删除成功',
    retrieved: '用户获取成功',
    list: '用户列表成功',
    found: '找到用户'
  },
  error: {
    creationFailed: '创建用户时出错',
    updateFailed: '更新用户时出错',
    deletionFailed: '删除用户时出错',
    retrievalFailed: '获取用户时出错',
    listFailed: '列出用户时出错',
    searchFailed: '搜索用户时出错',
    validationFailed: '验证错误',
    duplicate: '用户已注册',
    connectionError: '连接错误',
    databaseError: '数据库错误',
    unexpectedError: '意外错误',
    queryFailed: '查询错误'
  },
  warning: {
    notFound: '用户未找到',
    notUpdated: '用户未更新',
    notDeleted: '用户未删除',
    notRetrieved: '用户未检索到',
    notListed: '无法列出用户',
    notFoundSearch: '搜索中未找到用户',
    notMore: '没有更多用户可列出',
    isEmpty: '目前没有用户可以列出'
  }
}
