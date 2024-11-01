import { TUserAuthMessage } from '../../types'

export const authMessagesEn: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Password successfully updated',
      created: 'Password successfully created',
      retrieved: 'Password successfully retrieved'
    },
    error: {
      updateFailed: 'Error updating password',
      creationFailed: 'Error creating password',
      retrievalFailed: 'Error retrieving password',
      validationFailed: 'Validation error',
      unexpectedError: 'Unexpected error'
    },
    warning: {
      notMatch: 'Passwords do not match',
      isEmpty: 'Password cannot be empty'
    },
    validation: {
      isString: 'Password must be a string',
      isRequired: 'Password is required'
    }
  },
  login: {
    success: {
      completed: 'Login successful'
    },
    error: {
      validationFailed: 'Validation error during login',
      unexpectedError: 'Unexpected error during login'
    },
    warning: {
      notMatch: 'Incorrect password',
      isBlocked: 'User is blocked',
      notFound: 'User is not registered'
    },
    email: {
      isEmail: 'Email must be a valid email address',
      isRequired: 'Email is required',
      isString: 'Email must be a string'
    },
    password: {
      isString: 'Password must be a string',
      isRequired: 'Password is required',
      minLength: 'Password must be at least 6 characters long',
      isMissing: 'Password is not registered'
    }
  },
  session: {
    token: {
      isString: 'Token must be a string',
      isRequired: 'Token is required',
      isMissing: 'Token not found',
      isMatch: 'Token is invalid'
    },
    validation: {
      success: {
        completed: 'Session successfully validated'
      },
      error: {
        validationFailed: 'Session validation error',
        unexpectedError: 'Unexpected error during session validation'
      },
      warning: {
        notMatch: 'Invalid session',
        isExpired: 'Session token has expired'
      }
    }
  }
}
