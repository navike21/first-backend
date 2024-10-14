import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesDe: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Rollenname ist erforderlich',
    isString: 'Der Rollenname muss eine Zeichenkette sein',
    minLength: 'Der Rollenname muss mindestens 2 Zeichen lang sein',
    maxLength: 'Der Rollenname darf höchstens 50 Zeichen lang sein'
  },
  role: {
    isRequired: 'Die Rolle ist erforderlich',
    isString: 'Die Rolle muss eine Zeichenkette sein',
    isPattern:
      'Die Rolle darf nur Buchstaben, Zahlen, Bindestriche (-) und Unterstriche (_) enthalten, ohne Leerzeichen',
    minLength: 'Die Rolle muss mindestens 4 Zeichen lang sein',
    maxLength: 'Die Rolle darf höchstens 10 Zeichen lang sein'
  },
  systemModules: {
    isObject: 'Die Systemmodule müssen ein Objekt sein',
    isRequired: 'Systemmodule sind erforderlich',
    minLength: 'Mindestens ein Systemmodul ist erforderlich'
  }
}
