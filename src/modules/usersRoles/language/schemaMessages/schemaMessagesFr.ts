import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesFr: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Le nom du rôle est requis',
    isString: 'Le nom du rôle doit être une chaîne',
    minLength: 'Le nom du rôle doit comporter au moins 2 caractères',
    maxLength: 'Le nom du rôle ne doit pas dépasser 50 caractères'
  },
  role: {
    isRequired: 'Le rôle est requis',
    isString: 'Le rôle doit être une chaîne de caractères',
    isPattern:
      'Le rôle ne peut contenir que des lettres, des chiffres, des tirets (-) et des underscores (_), sans espaces',
    minLength: 'Le rôle doit contenir au moins 4 caractères',
    maxLength: 'Le rôle doit contenir au maximum 10 caractères'
  },
  systemModules: {
    isObject: 'Les modules système doivent être un objet',
    isRequired: 'Les modules système sont requis',
    minLength: 'Au moins un module système est requis'
  }
}
