import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesJp: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'ロール名は必須です',
    isString: 'ロール名は文字列である必要があります',
    minLength: 'ロール名は最小2文字である必要があります',
    maxLength: 'ロール名は最大50文字である必要があります'
  },
  role: {
    isRequired: 'ロールは必須です',
    isString: 'ロールは文字列である必要があります',
    isPattern:
      'ロールはスペースなしで文字、数字、ハイフン (-)、およびアンダースコア (_) のみを含むことができます',
    minLength: 'ロールは最小4文字である必要があります',
    maxLength: 'ロールは最大10文字である必要があります'
  },
  systemModules: {
    isObject: 'システムモジュールはオブジェクトである必要があります',
    isRequired: 'システムモジュールは必須です',
    minLength: '少なくとも1つのシステムモジュールが必要です'
  }
}
