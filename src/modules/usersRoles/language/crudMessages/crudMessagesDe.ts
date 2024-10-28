import { IMessages } from '../../../../common'

export const crudMessagesDe: IMessages = {
  success: {
    created: 'Rolle erfolgreich erstellt',
    updated: 'Rolle erfolgreich aktualisiert',
    deleted: 'Rolle erfolgreich gelöscht',
    retrieved: 'Rolle erfolgreich abgerufen',
    list: 'Rollen erfolgreich aufgelistet',
    found: 'Rolle gefunden'
  },
  error: {
    creationFailed: 'Fehler beim Erstellen der Rolle',
    updateFailed: 'Fehler beim Aktualisieren der Rolle',
    deletionFailed: 'Fehler beim Löschen der Rolle',
    retrievalFailed: 'Fehler beim Abrufen der Rolle',
    listFailed: 'Fehler beim Auflisten der Rollen',
    searchFailed: 'Fehler beim Suchen der Rolle',
    validationFailed: 'Validierungsfehler',
    duplicate: 'Rolle ist bereits registriert',
    connectionError: 'Verbindungsfehler',
    databaseError: 'Datenbankfehler',
    unexpectedError: 'Unerwarteter Fehler',
    queryFailed: 'Abfrage fehlgeschlagen'
  },
  warning: {
    notFound: 'Rolle nicht gefunden',
    notUpdated: 'Rolle nicht aktualisiert',
    notDeleted: 'Rolle nicht gelöscht',
    notRetrieved: 'Rolle nicht abgerufen',
    notListed: 'Rollen konnten nicht aufgelistet werden',
    notFoundSearch: 'Rolle nicht gefunden',
    notMore: 'Keine weiteren Rollen aufzulisten',
    isEmpty: 'Zurzeit keine Rollen zum Auflisten'
  }
}
