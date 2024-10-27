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
    creationFailed: 'Errore durante la creazione del ruolo',
    updateFailed: "Errore durante l'aggiornamento del ruolo",
    deletionFailed: "Errore durante l'eliminazione del ruolo",
    retrievalFailed: 'Errore durante il recupero del ruolo',
    listFailed: "Errore durante l'elenco dei ruoli",
    searchFailed: 'Errore durante la ricerca del ruolo',
    validationFailed: 'Errore di validazione',
    duplicate: 'Il ruolo è già registrato',
    connectionError: 'Errore di connessione',
    databaseError: 'Errore di database',
    unexpectedError: 'Errore inaspettato',
    queryFailed: 'Errore di query'
  },
  warning: {
    notFound: 'Il ruolo non è stato trovato',
    notUpdated: 'Il ruolo non è stato aggiornato',
    notDeleted: 'Il ruolo non è stato eliminato',
    notRetrieved: 'Il ruolo non è stato recuperato',
    notListed: 'Impossibile elencare i ruoli',
    notFoundSearch: 'Il ruolo non è stato trovato',
    notMore: 'Non ci sono altri ruoli da elencare',
    isEmpty: 'Non ci sono ruoli da elencare in questo momento'
  }
}
