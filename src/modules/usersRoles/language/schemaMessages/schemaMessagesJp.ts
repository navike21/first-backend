import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesJp: TUserRoleSchemaMessage = {
  name: {
    isRequired: '役割名が必要です',
    isString: '役割名は文字列でなければなりません',
    minLength: '役割名は2文字以上でなければなりません',
    maxLength: '役割名は最大50文字でなければなりません'
  },
  role: {
    isRequired: '役割は必須です',
    isString: '役割は文字列でなければなりません',
    isPattern:
      '役割には文字、数字、ダッシュ（-）、アンダースコア（_）のみを含めることができ、スペースは含まない',
    minLength: '役割は4文字以上でなければなりません',
    maxLength: '役割は10文字以内でなければなりません'
  },
  systemModules: {
    isObject: 'システムモジュールはオブジェクトである必要があります',
    isRequired: 'システムモジュールが必要です',
    minLength: '少なくとも1つのシステムモジュールが必要です'
  }
}
