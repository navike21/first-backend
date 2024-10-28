import { TUserSchemaMessage } from '../../types'

export const schemaMessagesZh: TUserSchemaMessage = {
  documentId: {
    isString: '身份证必须是字符串',
    minLength: '身份证至少应包含8个字符',
    maxLength: '身份证最多8个字符',
    isRequired: '身份证是必填项'
  },
  email: {
    isString: '电子邮件必须是字符串',
    isEmail: '电子邮件必须有效',
    isRequired: '电子邮件是必填项'
  },
  fatherLastName: {
    isString: '父亲的姓必须是字符串',
    minLength: '父亲的姓至少应包含2个字符',
    maxLength: '父亲的姓最多50个字符',
    isRequired: '父亲的姓是必填项'
  },
  image: {
    isString: '图片URL必须是字符串',
    isUrl: '图片URL必须有效'
  },
  motherLastName: {
    isString: '母亲的姓必须是字符串',
    minLength: '母亲的姓至少应包含2个字符',
    maxLength: '母亲的姓最多50个字符',
    isRequired: '母亲的姓是必填项'
  },
  names: {
    isString: '名字必须是字符串',
    minLength: '名字至少应包含2个字符',
    maxLength: '名字最多50个字符',
    isRequired: '名字是必填项'
  },
  phone: {
    isString: '电话必须是字符串',
    minLength: '电话至少应包含7个字符',
    maxLength: '电话最多15个字符'
  },
  dateOfBirth: {
    isDate: '出生日期必须是有效日期'
  }
}
