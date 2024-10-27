import { IMessages } from '../../../../common'

export const crudMessagesIt: IMessages = {
  success: {
    created: 'Utente creato con successo',
    updated: 'Utente aggiornato con successo',
    deleted: 'Utente eliminato con successo',
    retrieved: 'Utente recuperato con successo',
    list: 'Utenti elencati con successo',
    found: 'Utente trovato'
  },
  error: {
    creationFailed: "Errore nella creazione dell'utente",
    updateFailed: "Errore nell'aggiornamento dell'utente",
    deletionFailed: "Errore nell'eliminazione dell'utente",
    retrievalFailed: "Errore nel recupero dell'utente",
    listFailed: "Errore nell'elencare gli utenti",
    searchFailed: "Errore nella ricerca dell'utente",
    validationFailed: 'Errore di validazione',
    duplicate: "L'utente è già registrato",
    connectionError: 'Errore di connessione',
    databaseError: 'Errore del database',
    unexpectedError: 'Errore imprevisto',
    queryFailed: 'Errore nella query'
  },
  warning: {
    notFound: 'Utente non trovato',
    notUpdated: 'Utente non aggiornato',
    notDeleted: 'Utente non eliminato',
    notRetrieved: 'Utente non recuperato',
    notListed: 'Non è stato possibile elencare gli utenti',
    notFoundSearch: 'Utente non trovato nella ricerca',
    notMore: 'Non ci sono più utenti da elencare',
    isEmpty: 'Non ci sono utenti da elencare in questo momento'
  }
}
