import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesEn: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Role name is required',
    isString: 'Role name must be a string',
    minLength: 'Role name must have at least 2 characters',
    maxLength: 'Role name must have at most 50 characters'
  },
  role: {
    isRequired: 'Role is required',
    isString: 'Role must be a string',
    isPattern:
      'Role can only contain letters, numbers, dashes (-), and underscores (_), with no spaces',
    minLength: 'Role must be at least 4 characters long',
    maxLength: 'Role must be at most 10 characters long'
  },
  systemModules: {
    isObject: 'The system modules must be an object',
    isRequired: 'System modules are required',
    minLength: 'At least one system module is required'
  }
}
