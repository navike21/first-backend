import { TUserAuthMessage } from '../../types'

export const authMessagesKo: TUserAuthMessage = {
  password: {
    success: {
      updated: '비밀번호가 성공적으로 업데이트되었습니다',
      created: '비밀번호가 성공적으로 생성되었습니다',
      retrieved: '비밀번호가 성공적으로 복구되었습니다'
    },
    error: {
      updateFailed: '비밀번호 업데이트 오류',
      creationFailed: '비밀번호 생성 오류',
      retrievalFailed: '비밀번호 복구 오류',
      validationFailed: '검증 오류',
      unexpectedError: '예상치 못한 오류'
    },
    warning: {
      notMatch: '비밀번호가 일치하지 않습니다',
      isEmpty: '비밀번호는 비워둘 수 없습니다'
    },
    validation: {
      isString: '비밀번호는 문자열이어야 합니다',
      isRequired: '비밀번호는 필수입니다'
    }
  },
  login: {
    success: {
      completed: '로그인 성공'
    },
    error: {
      validationFailed: '로그인 검증 오류',
      unexpectedError: '로그인 중 예상치 못한 오류 발생'
    },
    warning: {
      notMatch: '비밀번호가 틀립니다',
      isBlocked: '사용자가 차단되었습니다',
      notFound: '사용자가 등록되지 않았습니다'
    },
    email: {
      isEmail: '이메일은 유효한 주소여야 합니다',
      isRequired: '이메일은 필수입니다',
      isString: '이메일은 문자열이어야 합니다'
    },
    password: {
      isString: '비밀번호는 문자열이어야 합니다',
      isRequired: '비밀번호는 필수입니다',
      minLength: '비밀번호는 최소 6자 이상이어야 합니다',
      isMissing: '비밀번호가 등록되지 않았습니다'
    }
  },
  session: {
    token: {
      isString: '토큰은 문자열이어야 합니다',
      isRequired: '토큰은 필수입니다',
      isMissing: '토큰을 찾을 수 없습니다',
      isMatch: '토큰이 유효하지 않습니다'
    },
    validation: {
      success: {
        completed: '세션이 성공적으로 검증되었습니다'
      },
      error: {
        validationFailed: '세션 검증 오류',
        unexpectedError: '세션 검증 중 예상치 못한 오류 발생'
      },
      warning: {
        notMatch: '유효하지 않은 세션입니다',
        isExpired: '세션 토큰이 만료되었습니다'
      }
    }
  }
}
