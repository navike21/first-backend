import { TUserAuthMessage } from '../../types'

export const authMessagesIt: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Password aggiornata con successo',
      created: 'Password creata con successo',
      retrieved: 'Password recuperata con successo'
    },
    error: {
      updateFailed: "Errore durante l'aggiornamento della password",
      creationFailed: 'Errore durante la creazione della password',
      retrievalFailed: 'Errore durante il recupero della password',
      validationFailed: 'Errore di convalida',
      unexpectedError: 'Errore inaspettato'
    },
    warning: {
      notMatch: 'Le password non corrispondono',
      isEmpty: 'La password non può essere vuota'
    },
    validation: {
      isString: 'La password deve essere una stringa',
      isRequired: 'La password è obbligatoria'
    }
  },
  login: {
    success: {
      completed: 'Accesso effettuato con successo'
    },
    error: {
      validationFailed: "Errore di convalida durante l'accesso",
      unexpectedError: "Errore inaspettato durante l'accesso"
    },
    warning: {
      notMatch: 'Password errata',
      isBlocked: "L'utente è bloccato",
      notFound: 'Utente non registrato'
    },
    email: {
      isEmail: "L'email deve essere valida",
      isRequired: "L'email è obbligatoria",
      isString: "L'email deve essere una stringa"
    },
    password: {
      isString: 'La password deve essere una stringa',
      isRequired: 'La password è obbligatoria',
      minLength: 'La password deve essere lunga almeno 6 caratteri',
      isMissing: 'La password non è registrata'
    }
  },
  session: {
    token: {
      isString: 'Il token deve essere una stringa',
      isRequired: 'Il token è obbligatorio',
      isMissing: 'Token non trovato',
      isMatch: 'Il token non è valido'
    },
    validation: {
      success: {
        completed: 'Sessione validata con successo'
      },
      error: {
        validationFailed: 'Errore di convalida della sessione',
        unexpectedError: 'Errore inaspettato nella validazione della sessione'
      },
      warning: {
        notMatch: 'Sessione non valida',
        isExpired: 'Il token di sessione è scaduto'
      }
    }
  }
}
