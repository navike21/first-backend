import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesKo: TUserRoleSchemaMessage = {
  name: {
    isRequired: '역할 이름은 필수입니다',
    isString: '역할 이름은 문자열이어야 합니다',
    minLength: '역할 이름은 최소 2자 이상이어야 합니다',
    maxLength: '역할 이름은 최대 50자까지 가능합니다'
  },
  role: {
    isRequired: '역할은 필수입니다',
    isString: '역할은 문자열이어야 합니다',
    isPattern:
      '역할은 공백 없이 문자, 숫자, 하이픈 (-) 및 밑줄 (_)만 포함할 수 있습니다',
    minLength: '역할은 최소 4자 이상이어야 합니다',
    maxLength: '역할은 최대 10자까지 가능합니다'
  },
  systemModules: {
    isObject: '시스템 모듈은 객체여야 합니다',
    isRequired: '시스템 모듈은 필수입니다',
    minLength: '최소 하나의 시스템 모듈이 있어야 합니다'
  }
}
