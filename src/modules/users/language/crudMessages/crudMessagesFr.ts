import { IMessages } from '../../../../common'

export const crudMessagesFr: IMessages = {
  success: {
    created: 'Utilisateur créé avec succès',
    updated: 'Utilisateur mis à jour avec succès',
    deleted: 'Utilisateur supprimé avec succès',
    retrieved: 'Utilisateur récupéré avec succès',
    list: 'Utilisateurs listés avec succès',
    found: 'Utilisateur trouvé'
  },
  error: {
    creationFailed: "Erreur lors de la création de l'utilisateur",
    updateFailed: "Erreur lors de la mise à jour de l'utilisateur",
    deletionFailed: "Erreur lors de la suppression de l'utilisateur",
    retrievalFailed: "Erreur lors de la récupération de l'utilisateur",
    listFailed: 'Erreur lors de la liste des utilisateurs',
    searchFailed: "Erreur lors de la recherche de l'utilisateur",
    validationFailed: 'Erreur de validation',
    duplicate: "L'utilisateur est déjà enregistré",
    connectionError: 'Erreur de connexion',
    databaseError: 'Erreur de base de données',
    unexpectedError: 'Erreur inattendue',
    queryFailed: 'Erreur de requête'
  },
  warning: {
    notFound: 'Utilisateur non trouvé',
    notUpdated: 'Utilisateur non mis à jour',
    notDeleted: 'Utilisateur non supprimé',
    notRetrieved: 'Utilisateur non récupéré',
    notListed: "Les utilisateurs n'ont pas pu être listés",
    notFoundSearch: 'Utilisateur non trouvé dans la recherche',
    notMore: "Plus d'utilisateurs à lister",
    isEmpty: 'Aucun utilisateur à lister pour le moment'
  }
}
