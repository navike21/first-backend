import { IMessages } from '../../../../common'

export const updatePasswordMessagesEn: IMessages = {
  success: {
    updated: 'Password updated successfully'
  },
  warning: {
    notUpdated: 'Password could not be updated',
    notMatch: 'Passwords do not match'
  },
  error: {
    updateFailed: 'Error updating password',
    unexpectedError: 'Unexpected error'
  }
}
