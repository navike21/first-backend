import { IMessages } from '../../../../common'

export const crudMessagesDe: IMessages = {
  success: {
    created: 'Benutzer erfolgreich erstellt',
    updated: 'Benutzer erfolgreich aktualisiert',
    deleted: 'Benutzer erfolgreich gelöscht',
    retrieved: 'Benutzer erfolgreich abgerufen',
    list: 'Benutzer erfolgreich aufgelistet',
    found: 'Benutzer gefunden'
  },
  error: {
    creationFailed: 'Fehler beim Erstellen des Benutzers',
    updateFailed: 'Fehler beim Aktualisieren des Benutzers',
    deletionFailed: 'Fehler beim Löschen des Benutzers',
    retrievalFailed: 'Fehler beim Abrufen des Benutzers',
    listFailed: 'Fehler beim Auflisten der Benutzer',
    searchFailed: 'Fehler beim Suchen des Benutzers',
    validationFailed: 'Validierungsfehler',
    duplicate: 'Benutzer ist bereits registriert',
    connectionError: 'Verbindungsfehler',
    databaseError: 'Datenbankfehler',
    unexpectedError: 'Unerwarteter Fehler',
    queryFailed: 'Abfragefehler'
  },
  warning: {
    notFound: 'Benutzer nicht gefunden',
    notUpdated: 'Benutzer nicht aktualisiert',
    notDeleted: 'Benutzer nicht gelöscht',
    notRetrieved: 'Benutzer nicht abgerufen',
    notListed: 'Benutzer konnten nicht aufgelistet werden',
    notFoundSearch: 'Benutzer in der Suche nicht gefunden',
    notMore: 'Keine weiter Benutzer zum Auflisten',
    isEmpty: 'Keine Benutzer zum Auflisten vorhanden'
  }
}
