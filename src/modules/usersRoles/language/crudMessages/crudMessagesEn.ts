import { IMessages } from '../../../../common'

export const crudMessagesEn: IMessages = {
  success: {
    created: 'Role created successfully',
    updated: 'Role updated successfully',
    deleted: 'Role deleted successfully',
    retrieved: 'Role retrieved successfully',
    list: 'Roles listed successfully',
    found: 'Role found'
  },
  error: {
    creationFailed: 'Failed to create the role',
    updateFailed: 'Failed to update the role',
    deletionFailed: 'Failed to delete the role',
    retrievalFailed: 'Failed to retrieve the role',
    listFailed: 'Failed to list roles',
    searchFailed: 'Failed to search for the role',
    validationFailed: 'Validation error',
    duplicate: 'The role is already registered',
    connectionError: 'Connection error',
    databaseError: 'Database error',
    unexpectedError: 'Unexpected error',
    queryFailed: 'Query error'
  },
  warning: {
    notFound: 'The role was not found',
    notUpdated: 'The role was not updated',
    notDeleted: 'The role was not deleted',
    notRetrieved: 'The role was not retrieved',
    notListed: 'Could not list the roles',
    notFoundSearch: 'The role was not found',
    notMore: 'No more roles to list',
    isEmpty: 'No roles to list at the moment'
  }
}
