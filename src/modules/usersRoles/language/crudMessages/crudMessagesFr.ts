import { IMessages } from '../../../../common'

export const crudMessagesFr: IMessages = {
  success: {
    created: 'Rôle créé avec succès',
    updated: 'Rôle mis à jour avec succès',
    deleted: 'Rôle supprimé avec succès',
    retrieved: 'Rôle récupéré avec succès',
    list: 'Rôles listés avec succès',
    found: 'Rôle trouvé'
  },
  error: {
    creationFailed: 'Échec de la création du rôle',
    updateFailed: 'Échec de la mise à jour du rôle',
    deletionFailed: 'Échec de la suppression du rôle',
    retrievalFailed: 'Échec de la récupération du rôle',
    listFailed: 'Échec de la liste des rôles',
    searchFailed: 'Échec de la recherche du rôle',
    validationFailed: 'Erreur de validation',
    duplicate: 'Le rôle est déjà enregistré',
    connectionError: 'Erreur de connexion',
    databaseError: 'Erreur de base de données',
    unexpectedError: 'Erreur inattendue',
    queryFailed: 'Échec de la requête'
  },
  warning: {
    notFound: 'Rôle non trouvé',
    notUpdated: 'Rôle non mis à jour',
    notDeleted: 'Rôle non supprimé',
    notRetrieved: 'Rôle non récupéré',
    notListed: 'Impossible de lister les rôles',
    notFoundSearch: 'Rôle non trouvé',
    notMore: 'Plus de rôles à lister',
    isEmpty: 'Aucun rôle à lister pour le moment'
  }
}
