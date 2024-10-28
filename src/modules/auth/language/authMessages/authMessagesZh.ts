import { TUserAuthMessage } from '../../types'

export const authMessagesZh: TUserAuthMessage = {
  password: {
    success: {
      updated: '密码已成功更新',
      created: '密码已成功创建',
      retrieved: '密码已成功检索'
    },
    error: {
      updateFailed: '更新密码失败',
      creationFailed: '创建密码失败',
      retrievalFailed: '检索密码失败',
      validationFailed: '验证错误',
      unexpectedError: '意外错误'
    },
    warning: {
      notMatch: '密码不匹配',
      isEmpty: '密码不能为空'
    },
    validation: {
      isString: '密码必须是字符串',
      isRequired: '密码是必填项'
    }
  }
}
