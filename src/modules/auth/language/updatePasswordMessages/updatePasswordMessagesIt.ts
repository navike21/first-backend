import { IMessages } from '../../../../common'

export const updatePasswordMessagesIt: IMessages = {
  success: {
    updated: 'Password aggiornata con successo'
  },
  warning: {
    notUpdated: 'Impossibile aggiornare la password',
    notMatch: 'Le password non corrispondono'
  },
  error: {
    updateFailed: "Errore durante l'aggiornamento della password",
    unexpectedError: 'Errore inaspettato'
  }
}
