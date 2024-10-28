import { IMessages } from '../../../../common'

export const crudMessagesIt: IMessages = {
  success: {
    created: 'Ruolo creato con successo',
    updated: 'Ruolo aggiornato con successo',
    deleted: 'Ruolo eliminato con successo',
    retrieved: 'Ruolo recuperato con successo',
    list: 'Ruoli elencati con successo',
    found: 'Ruolo trovato'
  },
  error: {
    creationFailed: 'Errore nella creazione del ruolo',
    updateFailed: "Errore nell'aggiornamento del ruolo",
    deletionFailed: 'Errore nella eliminazione del ruolo',
    retrievalFailed: 'Errore nel recupero del ruolo',
    listFailed: 'Errore nella lista dei ruoli',
    searchFailed: 'Errore nella ricerca del ruolo',
    validationFailed: 'Errore di validazione',
    duplicate: 'Il ruolo è già registrato',
    connectionError: 'Errore di connessione',
    databaseError: 'Errore del database',
    unexpectedError: 'Errore inaspettato',
    queryFailed: 'Errore nella query'
  },
  warning: {
    notFound: 'Ruolo non trovato',
    notUpdated: 'Ruolo non aggiornato',
    notDeleted: 'Ruolo non eliminato',
    notRetrieved: 'Ruolo non recuperato',
    notListed: 'Impossibile elencare i ruoli',
    notFoundSearch: 'Ruolo non trovato',
    notMore: 'Non ci sono più ruoli da elencare',
    isEmpty: 'Nessun ruolo da elencare al momento'
  }
}
