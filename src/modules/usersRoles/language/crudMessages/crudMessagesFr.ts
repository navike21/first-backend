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
    creationFailed: 'Erreur lors de la création du rôle',
    updateFailed: 'Erreur lors de la mise à jour du rôle',
    deletionFailed: 'Erreur lors de la suppression du rôle',
    retrievalFailed: 'Erreur lors de la récupération du rôle',
    listFailed: 'Erreur lors de la liste des rôles',
    searchFailed: 'Erreur lors de la recherche du rôle',
    validationFailed: 'Erreur de validation',
    duplicate: 'Le rôle est déjà enregistré',
    connectionError: 'Erreur de connexion',
    databaseError: 'Erreur de base de données',
    unexpectedError: 'Erreur inattendue',
    queryFailed: 'Erreur de requête'
  },
  warning: {
    notFound: "Le rôle n'a pas été trouvé",
    notUpdated: "Le rôle n'a pas été mis à jour",
    notDeleted: "Le rôle n'a pas été supprimé",
    notRetrieved: "Le rôle n'a pas été récupéré",
    notListed: 'Impossible de lister les rôles',
    notFoundSearch: "Le rôle n'a pas été trouvé",
    notMore: "Il n'y a plus de rôles à lister",
    isEmpty: "Il n'y a pas de rôles à lister pour le moment"
  }
}
