import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesZh: TUserRoleSchemaMessage = {
  name: {
    isRequired: '角色名称是必需的',
    isString: '角色名称必须是字符串',
    minLength: '角色名称必须至少为2个字符',
    maxLength: '角色名称最多为50个字符'
  },
  role: {
    isRequired: '角色是必需的',
    isString: '角色必须是字符串',
    isPattern: '角色只能包含字母、数字、连字符 (-) 和下划线 (_)，不能有空格',
    minLength: '角色必须至少为4个字符',
    maxLength: '角色最多为10个字符'
  },
  systemModules: {
    isObject: '系统模块必须是一个对象',
    isRequired: '系统模块是必需的',
    minLength: '必须至少有一个系统模块'
  }
}
