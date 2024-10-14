import { TUserRoleSchemaMessage } from '../../types'

export const schemaMessagesIt: TUserRoleSchemaMessage = {
  name: {
    isRequired: 'Il nome del ruolo è obbligatorio',
    isString: 'Il nome del ruolo deve essere una stringa',
    minLength: 'Il nome del ruolo deve avere almeno 2 caratteri',
    maxLength: 'Il nome del ruolo deve avere al massimo 50 caratteri'
  },
  role: {
    isRequired: 'Il ruolo è obbligatorio',
    isString: 'Il ruolo deve essere una stringa',
    isPattern:
      'Il ruolo può contenere solo lettere, numeri, trattini (-) e trattini bassi (_), senza spazi',
    minLength: 'Il ruolo deve contenere almeno 4 caratteri',
    maxLength: 'Il ruolo deve contenere al massimo 10 caratteri'
  },
  systemModules: {
    isObject: 'I moduli di sistema devono essere un oggetto',
    isRequired: 'I moduli di sistema sono obbligatori',
    minLength: 'È richiesto almeno un modulo di sistema'
  }
}
