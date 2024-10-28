import { TUserSchemaMessage } from '../../types'

export const schemaMessagesKo: TUserSchemaMessage = {
  documentId: {
    isString: '신분증 번호는 문자열이어야 합니다',
    minLength: '신분증 번호는 최소 8자 이상이어야 합니다',
    maxLength: '신분증 번호는 최대 8자이어야 합니다',
    isRequired: '신분증 번호는 필수 항목입니다'
  },
  email: {
    isString: '이메일은 문자열이어야 합니다',
    isEmail: '이메일은 유효한 형식이어야 합니다',
    isRequired: '이메일은 필수 항목입니다'
  },
  fatherLastName: {
    isString: '아버지의 성은 문자열이어야 합니다',
    minLength: '아버지의 성은 최소 2자 이상이어야 합니다',
    maxLength: '아버지의 성은 최대 50자이어야 합니다',
    isRequired: '아버지의 성은 필수 항목입니다'
  },
  image: {
    isString: '이미지 URL은 문자열이어야 합니다',
    isUrl: '이미지 URL은 유효해야 합니다'
  },
  motherLastName: {
    isString: '어머니의 성은 문자열이어야 합니다',
    minLength: '어머니의 성은 최소 2자 이상이어야 합니다',
    maxLength: '어머니의 성은 최대 50자이어야 합니다',
    isRequired: '어머니의 성은 필수 항목입니다'
  },
  names: {
    isString: '이름은 문자열이어야 합니다',
    minLength: '이름은 최소 2자 이상이어야 합니다',
    maxLength: '이름은 최대 50자이어야 합니다',
    isRequired: '이름은 필수 항목입니다'
  },
  phone: {
    isString: '전화번호는 문자열이어야 합니다',
    minLength: '전화번호는 최소 7자 이상이어야 합니다',
    maxLength: '전화번호는 최대 15자이어야 합니다'
  },
  dateOfBirth: {
    isDate: '생년월일은 유효한 날짜여야 합니다'
  }
}
