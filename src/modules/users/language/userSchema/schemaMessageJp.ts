import { TUserSchemaMessage } from '../../types'

export const schemaMessageJp: TUserSchemaMessage = {
  documentId: {
    isString: '身分証明書は文字列でなければなりません',
    minLength: '身分証明書は少なくとも8文字でなければなりません',
    maxLength: '身分証明書は最大8文字でなければなりません',
    isRequired: '身分証明書は必須です'
  },
  email: {
    isString: 'メールアドレスは文字列でなければなりません',
    isEmail: 'メールアドレスは有効でなければなりません',
    isRequired: 'メールアドレスは必須です'
  },
  fatherLastName: {
    isString: '父親の姓は文字列でなければなりません',
    minLength: '父親の姓は少なくとも2文字でなければなりません',
    maxLength: '父親の姓は最大50文字でなければなりません',
    isRequired: '父親の姓は必須です'
  },
  image: {
    isString: '画像のURLは文字列でなければなりません',
    isUrl: '画像のURLは有効でなければなりません'
  },
  motherLastName: {
    isString: '母親の姓は文字列でなければなりません',
    minLength: '母親の姓は少なくとも2文字でなければなりません',
    maxLength: '母親の姓は最大50文字でなければなりません',
    isRequired: '母親の姓は必須です'
  },
  name: {
    isString: '名前は文字列でなければなりません',
    minLength: '名前は少なくとも2文字でなければなりません',
    maxLength: '名前は最大50文字でなければなりません',
    isRequired: '名前は必須です'
  },
  password: {
    isString: 'パスワードは文字列でなければなりません',
    minLength: 'パスワードは少なくとも8文字でなければなりません',
    maxLength: 'パスワードは最大12文字でなければなりません',
    isRequired: 'パスワードは必須です'
  },
  phone: {
    isString: '電話番号は文字列でなければなりません',
    minLength: '電話番号は少なくとも7文字でなければなりません',
    maxLength: '電話番号は最大15文字でなければなりません'
  },
  dateOfBirth: {
    isDate: '生年月日は日付でなければなりません'
  }
}
