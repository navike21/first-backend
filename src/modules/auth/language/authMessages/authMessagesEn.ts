import { TUserAuthMessage } from '../../types'

export const authMessagesEn: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Password updated successfully',
      created: 'Password created successfully',
      retrieved: 'Password retrieved successfully'
    },
    error: {
      updateFailed: 'Failed to update password',
      creationFailed: 'Failed to create password',
      retrievalFailed: 'Failed to retrieve password',
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
  }
}
