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
      unexpectedError: 'Errore imprevisto'
    },
    warning: {
      notMatch: 'Le password non coincidono',
      isEmpty: 'La password non può essere vuota'
    },
    validation: {
      isString: 'La password deve essere una stringa',
      isRequired: 'La password è richiesta'
    }
  }
}
