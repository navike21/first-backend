import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesFr: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Le nom du rôle est requis',
    isString: 'Le nom du rôle doit être une chaîne',
    minLength: 'Le nom du rôle doit comporter au moins 2 caractères',
    maxLength: 'Le nom du rôle doit comporter au maximum 50 caractères'
  },
  role: {
    isRequired: 'Le rôle est requis',
    isString: 'Le rôle doit être une chaîne',
    isPattern:
      'Le rôle ne peut contenir que des lettres, des chiffres, des tirets (-) et des traits de soulignement (_), sans espaces',
    minLength: 'Le rôle doit comporter au moins 4 caractères',
    maxLength: 'Le rôle doit comporter au maximum 10 caractères'
  },
  systemModules: {
    isObject: 'Les modules du système doivent être un objet',
    isRequired: 'Les modules du système sont requis',
    minLength: 'Il doit y avoir au moins un module système'
  }
}
