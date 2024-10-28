import { TUserAuthMessage } from '../../types'

export const authMessagesDe: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Passwort erfolgreich aktualisiert',
      created: 'Passwort erfolgreich erstellt',
      retrieved: 'Passwort erfolgreich abgerufen'
    },
    error: {
      updateFailed: 'Fehler beim Aktualisieren des Passworts',
      creationFailed: 'Fehler beim Erstellen des Passworts',
      retrievalFailed: 'Fehler beim Abrufen des Passworts',
      validationFailed: 'Validierungsfehler',
      unexpectedError: 'Unerwarteter Fehler'
    },
    warning: {
      notMatch: 'Passwörter stimmen nicht überein',
      isEmpty: 'Passwort darf nicht leer sein'
    },
    validation: {
      isString: 'Passwort muss ein String sein',
      isRequired: 'Passwort ist erforderlich'
    }
  }
}
