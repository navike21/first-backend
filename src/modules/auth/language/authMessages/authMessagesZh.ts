import { TUserAuthMessage } from '../../types'

export const authMessagesZh: TUserAuthMessage = {
  password: {
    success: {
      updated: '密码更新成功',
      created: '密码创建成功',
      retrieved: '密码找回成功'
    },
    error: {
      updateFailed: '更新密码时出错',
      creationFailed: '创建密码时出错',
      retrievalFailed: '找回密码时出错',
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
  },
  login: {
    success: {
      completed: '登录成功'
    },
    error: {
      validationFailed: '登录验证失败',
      unexpectedError: '登录时发生意外错误'
    },
    warning: {
      notMatch: '密码错误',
      isBlocked: '用户已被锁定',
      notFound: '用户未注册'
    },
    email: {
      isEmail: '电子邮件必须是有效的电子邮件',
      isRequired: '电子邮件是必填项',
      isString: '电子邮件必须是字符串'
    },
    password: {
      isString: '密码必须是字符串',
      isRequired: '密码是必填项',
      minLength: '密码长度必须至少为6个字符',
      isMissing: '密码未注册'
    }
  },
  session: {
    token: {
      isString: '令牌必须是字符串',
      isRequired: '令牌是必填项',
      isMissing: '未找到令牌',
      isMatch: '令牌无效'
    },
    validation: {
      success: {
        completed: '会话验证成功'
      },
      error: {
        validationFailed: '会话验证错误',
        unexpectedError: '会话验证时发生意外错误'
      },
      warning: {
        notMatch: '无效的会话',
        isExpired: '会话令牌已过期'
      }
    }
  }
}
