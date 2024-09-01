import { TUserSchemaMessage } from '../../types'

export const schemaMessagesDe: TUserSchemaMessage = {
  documentId: {
    isString: 'Die Identifikationsnummer muss eine Zeichenkette sein',
    minLength: 'Die Identifikationsnummer muss mindestens 8 Zeichen haben',
    maxLength: 'Die Identifikationsnummer darf höchstens 8 Zeichen haben',
    isRequired: 'Die Identifikationsnummer ist erforderlich'
  },
  email: {
    isString: 'Die E-Mail-Adresse muss eine Zeichenkette sein',
    isEmail: 'Die E-Mail-Adresse muss gültig sein',
    isRequired: 'Die E-Mail-Adresse ist erforderlich'
  },
  fatherLastName: {
    isString: 'Der Nachname des Vaters muss eine Zeichenkette sein',
    minLength: 'Der Nachname des Vaters muss mindestens 2 Zeichen haben',
    maxLength: 'Der Nachname des Vaters darf höchstens 50 Zeichen haben',
    isRequired: 'Der Nachname des Vaters ist erforderlich'
  },
  image: {
    isString: 'Die Bild-URL muss eine Zeichenkette sein',
    isUrl: 'Die Bild-URL muss gültig sein'
  },
  motherLastName: {
    isString: 'Der Nachname der Mutter muss eine Zeichenkette sein',
    minLength: 'Der Nachname der Mutter muss mindestens 2 Zeichen haben',
    maxLength: 'Der Nachname der Mutter darf höchstens 50 Zeichen haben',
    isRequired: 'Der Nachname der Mutter ist erforderlich'
  },
  names: {
    isString: 'Der Name muss eine Zeichenkette sein',
    minLength: 'Der Name muss mindestens 2 Zeichen haben',
    maxLength: 'Der Name darf höchstens 50 Zeichen haben',
    isRequired: 'Der Name ist erforderlich'
  },
  phone: {
    isString: 'Die Telefonnummer muss eine Zeichenkette sein',
    minLength: 'Die Telefonnummer muss mindestens 7 Zeichen haben',
    maxLength: 'Die Telefonnummer darf höchstens 15 Zeichen haben'
  },
  dateOfBirth: {
    isDate: 'Das Geburtsdatum muss ein Datum sein'
  }
}
