import { IFilesMessage } from '../../types'

export const filesMessagesFr: IFilesMessage = {
  files: {
    error: {
      uploadFailed: "Échec de l'envoi du fichier",
      uploadsFailed: "Échec de l'envoi des fichiers",
      unexpectedError: "Erreur inattendue lors de l'envoi des fichiers",
      deletionFailed: 'Erreur lors de la suppression du fichier'
    },
    success: {
      completed: 'Les fichiers ont été téléchargés avec succès',
      list: 'Liste de fichiers obtenue avec succès',
      found: 'Fichier trouvé avec succès',
      retrieved: 'Fichier récupéré avec succès'
    },
    warning: {
      notFound: 'Aucun fichier trouvé à télécharger sur le serveur',
      notDeleted: "Les fichiers n'ont pas pu être supprimés",
      notRetrieved: "Le fichier n'a pas pu être récupéré",
      notFoundSearch: 'Aucun fichier trouvé avec les critères de recherche',
      notMore: 'Plus de fichiers à afficher',
      notMatch: 'Type de fichier non autorisé'
    }
  }
}
