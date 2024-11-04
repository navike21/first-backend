import { TFilesMessage } from '../../types'

export const filesMessagesDe: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Fehler beim Hochladen der Dateien',
      unexpectedError: 'Unerwarteter Fehler',
      deletionFailed: 'Fehler beim Löschen der Dateien'
    },
    success: {
      completed: 'Die Dateien wurden erfolgreich hochgeladen',
      list: 'Die Dateien wurden erfolgreich aufgelistet',
      deleted: 'Dateien erfolgreich gelöscht'
    },
    warning: {
      notFound: 'Die Dateien wurden nicht gefunden',
      notFoundToDelete: 'Keine zu löschenden Dateien gefunden',
      notDeleted: 'Die Dateien konnten nicht gelöscht werden',
      notRetrieved: 'Die Dateien konnten nicht abgerufen werden',
      notFoundSearch: 'Keine Dateien mit den Suchkriterien gefunden',
      notMore: 'Es gibt keine weiteren Dateien zum Anzeigen'
    }
  },
  file: {
    error: {
      deletionFailed: 'Fehler beim Löschen der Datei'
    },
    success: {
      deleted: 'Datei erfolgreich gelöscht'
    },
    warning: {
      notFound: 'Datei nicht gefunden',
      notDeleted: 'Datei konnte nicht gelöscht werden',
      notRetrieved: 'Datei konnte nicht abgerufen werden',
      notMatch: 'Dateityp nicht erlaubt'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'Die Datei-ID ist erforderlich',
      isString: 'Die Datei-ID muss eine Zeichenkette sein',
      isArray: 'Die Datei-ID muss ein Array sein'
    }
  }
}
