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
    duplicate: 'Die Rolle ist bereits registriert',
    connectionError: 'Verbindungsfehler',
    databaseError: 'Datenbankfehler',
    unexpectedError: 'Unerwarteter Fehler',
    queryFailed: 'Abfragefehler'
  },
  warning: {
    notFound: 'Die Rolle wurde nicht gefunden',
    notUpdated: 'Die Rolle wurde nicht aktualisiert',
    notDeleted: 'Die Rolle wurde nicht gelöscht',
    notRetrieved: 'Die Rolle wurde nicht abgerufen',
    notListed: 'Die Rollen konnten nicht aufgelistet werden',
    notFoundSearch: 'Die Rolle wurde nicht gefunden',
    notMore: 'Es gibt keine weiteren Rollen aufzulisten',
    isEmpty: 'Es gibt momentan keine Rollen aufzulisten'
  }
}
