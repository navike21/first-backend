import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesDe: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Der Rollenname ist erforderlich',
    isString: 'Der Rollenname muss eine Zeichenkette sein',
    minLength: 'Der Rollenname muss mindestens 2 Zeichen lang sein',
    maxLength: 'Der Rollenname darf maximal 50 Zeichen lang sein'
  },
  role: {
    isRequired: 'Die Rolle ist erforderlich',
    isString: 'Die Rolle muss eine Zeichenkette sein',
    isPattern:
      'Die Rolle darf nur Buchstaben, Zahlen, Bindestriche (-) und Unterstriche (_) enthalten, ohne Leerzeichen',
    minLength: 'Die Rolle muss mindestens 4 Zeichen lang sein',
    maxLength: 'Die Rolle darf maximal 10 Zeichen lang sein'
  },
  systemModules: {
    isObject: 'Die Systemmodule müssen ein Objekt sein',
    isRequired: 'Die Systemmodule sind erforderlich',
    minLength: 'Es muss mindestens ein Systemmodul vorhanden sein'
  }
}
