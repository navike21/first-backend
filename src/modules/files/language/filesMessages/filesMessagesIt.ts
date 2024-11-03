import { IFilesMessage } from '../../types'

export const filesMessagesIt: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Errore nel caricamento del file',
      uploadsFailed: 'Errore nel caricamento dei file',
      unexpectedError: 'Errore imprevisto durante il caricamento dei file',
      deletionFailed: 'Errore nella cancellazione del file'
    },
    success: {
      completed: 'File caricati con successo',
      list: 'Lista dei file ottenuta con successo',
      found: 'File trovato con successo',
      retrieved: 'File recuperato con successo'
    },
    warning: {
      notFound: 'Nessun file trovato da caricare sul server',
      notDeleted: 'Impossibile eliminare i file',
      notRetrieved: 'Impossibile recuperare il file',
      notFoundSearch: 'Nessun file trovato con i criteri di ricerca',
      notMore: 'Non ci sono più file da mostrare',
      notMatch: 'Tipo di file non consentito'
    }
  }
}
