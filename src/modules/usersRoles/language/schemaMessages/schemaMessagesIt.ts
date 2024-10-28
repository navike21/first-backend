import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesIt: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Il nome del ruolo è richiesto',
    isString: 'Il nome del ruolo deve essere una stringa',
    minLength: 'Il nome del ruolo deve avere almeno 2 caratteri',
    maxLength: 'Il nome del ruolo può avere al massimo 50 caratteri'
  },
  role: {
    isRequired: 'Il ruolo è richiesto',
    isString: 'Il ruolo deve essere una stringa',
    isPattern:
      'Il ruolo può contenere solo lettere, numeri, trattini (-) e trattini bassi (_), senza spazi',
    minLength: 'Il ruolo deve avere almeno 4 caratteri',
    maxLength: 'Il ruolo può avere al massimo 10 caratteri'
  },
  systemModules: {
    isObject: 'I moduli di sistema devono essere un oggetto',
    isRequired: 'I moduli di sistema sono richiesti',
    minLength: 'Deve esserci almeno un modulo di sistema'
  }
}
