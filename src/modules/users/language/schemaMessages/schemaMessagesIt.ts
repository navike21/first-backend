import { TUserSchemaMessage } from '../../types'

export const schemaMessagesIt: TUserSchemaMessage = {
  documentId: {
    isString: "Il documento d'identità deve essere una stringa",
    minLength: "Il documento d'identità deve avere almeno 8 caratteri",
    maxLength: "Il documento d'identità deve avere al massimo 8 caratteri",
    isRequired: "Il documento d'identità è obbligatorio"
  },
  email: {
    isString: "L'email deve essere una stringa",
    isEmail: "L'email deve essere valida",
    isRequired: "L'email è obbligatoria"
  },
  fatherLastName: {
    isString: 'Il cognome del padre deve essere una stringa',
    minLength: 'Il cognome del padre deve avere almeno 2 caratteri',
    maxLength: 'Il cognome del padre deve avere al massimo 50 caratteri',
    isRequired: 'Il cognome del padre è obbligatorio'
  },
  image: {
    isString: "L'URL dell'immagine deve essere una stringa",
    isUrl: "L'URL dell'immagine deve essere valido"
  },
  motherLastName: {
    isString: 'Il cognome della madre deve essere una stringa',
    minLength: 'Il cognome della madre deve avere almeno 2 caratteri',
    maxLength: 'Il cognome della madre deve avere al massimo 50 caratteri',
    isRequired: 'Il cognome della madre è obbligatorio'
  },
  names: {
    isString: 'Il nome deve essere una stringa',
    minLength: 'Il nome deve avere almeno 2 caratteri',
    maxLength: 'Il nome deve avere al massimo 50 caratteri',
    isRequired: 'Il nome è obbligatorio'
  },
  phone: {
    isString: 'Il numero di telefono deve essere una stringa',
    minLength: 'Il numero di telefono deve avere almeno 7 caratteri',
    maxLength: 'Il numero di telefono deve avere al massimo 15 caratteri'
  },
  dateOfBirth: {
    isDate: 'La data di nascita deve essere una data valida'
  }
}
