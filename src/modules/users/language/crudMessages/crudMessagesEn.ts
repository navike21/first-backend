import { IMessages } from '../../../../common'

export const crudMessagesEn: IMessages = {
  success: {
    created: 'User created successfully',
    updated: 'User updated successfully',
    deleted: 'User deleted successfully',
    retrieved: 'User retrieved successfully',
    list: 'Users listed successfully',
    found: 'User found'
  },
  error: {
    creationFailed: 'Error creating user',
    updateFailed: 'Error updating user',
    deletionFailed: 'Error deleting user',
    retrievalFailed: 'Error retrieving user',
    listFailed: 'Error listing users',
    searchFailed: 'Error searching for user',
    validationFailed: 'Validation error',
    duplicate: 'User is already registered',
    connectionError: 'Connection error',
    databaseError: 'Database error',
    unexpectedError: 'Unexpected error',
    queryFailed: 'Query error'
  },
  warning: {
    notFound: 'User not found',
    notUpdated: 'User not updated',
    notDeleted: 'User not deleted',
    notRetrieved: 'User not retrieved',
    notListed: 'Users could not be listed',
    notFoundSearch: 'User not found in search',
    notMore: 'No more users to list',
    isEmpty: 'No users to list at this time'
  }
}
