import { TUserSchemaMessage } from '../../types'

export const schemaMessagesDe: TUserSchemaMessage = {
  documentId: {
    isString: 'Die Ausweisnummer muss eine Zeichenkette sein',
    minLength: 'Die Ausweisnummer muss mindestens 8 Zeichen lang sein',
    maxLength: 'Die Ausweisnummer darf maximal 8 Zeichen lang sein',
    isRequired: 'Die Ausweisnummer ist erforderlich'
  },
  email: {
    isString: 'Die E-Mail muss eine Zeichenkette sein',
    isEmail: 'Die E-Mail muss gültig sein',
    isRequired: 'Die E-Mail ist erforderlich'
  },
  fatherLastName: {
    isString: 'Der Nachname des Vaters muss eine Zeichenkette sein',
    minLength: 'Der Nachname des Vaters muss mindestens 2 Zeichen lang sein',
    maxLength: 'Der Nachname des Vaters darf maximal 50 Zeichen lang sein',
    isRequired: 'Der Nachname des Vaters ist erforderlich'
  },
  image: {
    isString: 'Die Bild-URL muss eine Zeichenkette sein',
    isUrl: 'Die Bild-URL muss gültig sein'
  },
  motherLastName: {
    isString: 'Der Nachname der Mutter muss eine Zeichenkette sein',
    minLength: 'Der Nachname der Mutter muss mindestens 2 Zeichen lang sein',
    maxLength: 'Der Nachname der Mutter darf maximal 50 Zeichen lang sein',
    isRequired: 'Der Nachname der Mutter ist erforderlich'
  },
  names: {
    isString: 'Der Vorname muss eine Zeichenkette sein',
    minLength: 'Der Vorname muss mindestens 2 Zeichen lang sein',
    maxLength: 'Der Vorname darf maximal 50 Zeichen lang sein',
    isRequired: 'Der Vorname ist erforderlich'
  },
  phone: {
    isString: 'Die Telefonnummer muss eine Zeichenkette sein',
    minLength: 'Die Telefonnummer muss mindestens 7 Zeichen lang sein',
    maxLength: 'Die Telefonnummer darf maximal 15 Zeichen lang sein'
  },
  dateOfBirth: {
    isDate: 'Das Geburtsdatum muss ein Datum sein'
  }
}
