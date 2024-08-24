import { TUserSchemaMessage } from '../../types'

export const schemaMessageIt: TUserSchemaMessage = {
  documentId: {
    isString: 'Il documento di identità deve essere una stringa',
    minLength: 'Il documento di identità deve contenere almeno 8 caratteri',
    maxLength: 'Il documento di identità deve contenere al massimo 8 caratteri',
    isRequired: 'Il documento di identità è obbligatorio'
  },
  email: {
    isString: "L'email deve essere una stringa",
    isEmail: "L'email deve essere valida",
    isRequired: "L'email è obbligatoria"
  },
  fatherLastName: {
    isString: 'Il cognome del padre deve essere una stringa',
    minLength: 'Il cognome del padre deve contenere almeno 2 caratteri',
    maxLength: 'Il cognome del padre deve contenere al massimo 50 caratteri',
    isRequired: 'Il cognome del padre è obbligatorio'
  },
  image: {
    isString: "L'URL dell'immagine deve essere una stringa",
    isUrl: "L'URL dell'immagine deve essere valido"
  },
  motherLastName: {
    isString: 'Il cognome della madre deve essere una stringa',
    minLength: 'Il cognome della madre deve contenere almeno 2 caratteri',
    maxLength: 'Il cognome della madre deve contenere al massimo 50 caratteri',
    isRequired: 'Il cognome della madre è obbligatorio'
  },
  names: {
    isString: 'Il nome deve essere una stringa',
    minLength: 'Il nome deve contenere almeno 2 caratteri',
    maxLength: 'Il nome deve contenere al massimo 50 caratteri',
    isRequired: 'Il nome è obbligatorio'
  },
  phone: {
    isString: 'Il telefono deve essere una stringa',
    minLength: 'Il telefono deve contenere almeno 7 caratteri',
    maxLength: 'Il telefono deve contenere al massimo 15 caratteri'
  },
  dateOfBirth: {
    isDate: 'La data di nascita deve essere una data'
  }
}
