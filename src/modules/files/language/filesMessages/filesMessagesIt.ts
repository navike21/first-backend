import { TFilesMessage } from '../../types'

export const filesMessagesIt: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Errore durante il caricamento dei file',
      unexpectedError: 'Errore imprevisto',
      deletionFailed: "Errore durante l'eliminazione dei file"
    },
    success: {
      completed: 'File caricati correttamente',
      list: 'File elencati correttamente',
      deleted: 'File eliminati correttamente'
    },
    warning: {
      notFound: 'File non trovati',
      notFoundToDelete: 'Nessun file da eliminare trovato',
      notDeleted: 'I file non possono essere eliminati',
      notRetrieved: 'I file non possono essere recuperati',
      notFoundSearch: 'Nessun file trovato con i criteri di ricerca',
      notMore: 'Non ci sono altri file da visualizzare'
    }
  },
  file: {
    error: {
      deletionFailed: "Errore durante l'eliminazione del file"
    },
    success: {
      deleted: 'File eliminato correttamente'
    },
    warning: {
      notFound: 'File non trovato',
      notDeleted: 'Il file non può essere eliminato',
      notRetrieved: 'Il file non può essere recuperato',
      notMatch: 'Tipo di file non consentito'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'ID del file richiesto',
      isString: "L'ID del file deve essere una stringa",
      isArray: "L'ID del file deve essere un array"
    }
  }
}
