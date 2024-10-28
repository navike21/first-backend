import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesEn: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'The role name is required',
    isString: 'The role name must be a string',
    minLength: 'The role name must be at least 2 characters long',
    maxLength: 'The role name must be at most 50 characters long'
  },
  role: {
    isRequired: 'The role is required',
    isString: 'The role must be a string',
    isPattern:
      'The role can only contain letters, numbers, hyphens (-), and underscores (_), without spaces',
    minLength: 'The role must be at least 4 characters long',
    maxLength: 'The role must be at most 10 characters long'
  },
  systemModules: {
    isObject: 'The system modules must be an object',
    isRequired: 'The system modules are required',
    minLength: 'There must be at least one system module'
  }
}
