import { TUserAuthMessage } from '../../types'

export const authMessagesDe: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Passwort erfolgreich aktualisiert',
      created: 'Passwort erfolgreich erstellt',
      retrieved: 'Passwort erfolgreich wiederhergestellt'
    },
    error: {
      updateFailed: 'Fehler beim Aktualisieren des Passworts',
      creationFailed: 'Fehler beim Erstellen des Passworts',
      retrievalFailed: 'Fehler beim Wiederherstellen des Passworts',
      validationFailed: 'Validierungsfehler',
      unexpectedError: 'Unerwarteter Fehler'
    },
    warning: {
      notMatch: 'Passwörter stimmen nicht überein',
      isEmpty: 'Das Passwort darf nicht leer sein'
    },
    validation: {
      isString: 'Das Passwort muss eine Zeichenkette sein',
      isRequired: 'Das Passwort ist erforderlich'
    }
  },
  login: {
    success: {
      completed: 'Anmeldung erfolgreich'
    },
    error: {
      validationFailed: 'Validierungsfehler bei der Anmeldung',
      unexpectedError: 'Unerwarteter Fehler bei der Anmeldung'
    },
    warning: {
      notMatch: 'Falsches Passwort',
      isBlocked: 'Der Benutzer ist gesperrt',
      notFound: 'Benutzer ist nicht registriert'
    },
    email: {
      isEmail: 'Die E-Mail muss gültig sein',
      isRequired: 'Die E-Mail ist erforderlich',
      isString: 'Die E-Mail muss eine Zeichenkette sein'
    },
    password: {
      isString: 'Das Passwort muss eine Zeichenkette sein',
      isRequired: 'Das Passwort ist erforderlich',
      minLength: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      isMissing: 'Das Passwort ist nicht registriert'
    }
  },
  session: {
    token: {
      isString: 'Das Token muss eine Zeichenkette sein',
      isRequired: 'Das Token ist erforderlich',
      isMissing: 'Token nicht gefunden',
      isMatch: 'Token ist ungültig'
    },
    validation: {
      success: {
        completed: 'Sitzung erfolgreich validiert'
      },
      error: {
        validationFailed: 'Validierungsfehler in der Sitzung',
        unexpectedError: 'Unerwarteter Fehler bei der Sitzungsvalidierung'
      },
      warning: {
        notMatch: 'Sitzung ist ungültig',
        isExpired: 'Das Sitzungstoken ist abgelaufen'
      }
    }
  }
}
