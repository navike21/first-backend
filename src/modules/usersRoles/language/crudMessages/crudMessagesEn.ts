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
    creationFailed: 'Failed to create role',
    updateFailed: 'Failed to update role',
    deletionFailed: 'Failed to delete role',
    retrievalFailed: 'Failed to retrieve role',
    listFailed: 'Failed to list roles',
    searchFailed: 'Failed to search role',
    validationFailed: 'Validation error',
    duplicate: 'Role is already registered',
    connectionError: 'Connection error',
    databaseError: 'Database error',
    unexpectedError: 'Unexpected error',
    queryFailed: 'Query failed'
  },
  warning: {
    notFound: 'Role not found',
    notUpdated: 'Role not updated',
    notDeleted: 'Role not deleted',
    notRetrieved: 'Role not retrieved',
    notListed: 'Roles could not be listed',
    notFoundSearch: 'Role not found',
    notMore: 'No more roles to list',
    isEmpty: 'No roles to list at the moment'
  }
}
