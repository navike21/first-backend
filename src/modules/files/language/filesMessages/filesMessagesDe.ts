import { IFilesMessage } from '../../types'

export const filesMessagesDe: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Fehler beim Hochladen der Datei',
      uploadsFailed: 'Fehler beim Hochladen der Dateien',
      unexpectedError: 'Unerwarteter Fehler beim Hochladen der Dateien',
      deletionFailed: 'Fehler beim Löschen der Datei'
    },
    success: {
      completed: 'Die Dateien wurden erfolgreich hochgeladen',
      list: 'Dateiliste erfolgreich abgerufen',
      found: 'Datei erfolgreich gefunden',
      retrieved: 'Datei erfolgreich abgerufen'
    },
    warning: {
      notFound: 'Keine Dateien zum Hochladen auf den Server gefunden',
      notDeleted: 'Dateien konnten nicht gelöscht werden',
      notRetrieved: 'Datei konnte nicht abgerufen werden',
      notFoundSearch: 'Keine Dateien mit den Suchkriterien gefunden',
      notMore: 'Keine weiteren Dateien zum Anzeigen',
      notMatch: 'Dateityp nicht erlaubt'
    }
  }
}
