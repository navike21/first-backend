import { TUserSchemaMessage } from '../../types'

export const schemaMessagesJp: TUserSchemaMessage = {
  documentId: {
    isString: '身分証明書は文字列でなければなりません',
    minLength: '身分証明書は8文字以上である必要があります',
    maxLength: '身分証明書は最大8文字でなければなりません',
    isRequired: '身分証明書は必須です'
  },
  email: {
    isString: 'メールアドレスは文字列でなければなりません',
    isEmail: '有効なメールアドレスでなければなりません',
    isRequired: 'メールアドレスは必須です'
  },
  fatherLastName: {
    isString: '父の姓は文字列でなければなりません',
    minLength: '父の姓は少なくとも2文字である必要があります',
    maxLength: '父の姓は最大50文字でなければなりません',
    isRequired: '父の姓は必須です'
  },
  image: {
    isString: '画像URLは文字列でなければなりません',
    isUrl: '画像URLは有効である必要があります'
  },
  motherLastName: {
    isString: '母の姓は文字列でなければなりません',
    minLength: '母の姓は少なくとも2文字である必要があります',
    maxLength: '母の姓は最大50文字でなければなりません',
    isRequired: '母の姓は必須です'
  },
  names: {
    isString: '名前は文字列でなければなりません',
    minLength: '名前は少なくとも2文字である必要があります',
    maxLength: '名前は最大50文字でなければなりません',
    isRequired: '名前は必須です'
  },
  phone: {
    isString: '電話番号は文字列でなければなりません',
    minLength: '電話番号は少なくとも7文字である必要があります',
    maxLength: '電話番号は最大15文字でなければなりません'
  },
  dateOfBirth: {
    isDate: '生年月日は有効な日付である必要があります'
  }
}
