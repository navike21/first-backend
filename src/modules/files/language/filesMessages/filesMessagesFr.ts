import { TFilesMessage } from '../../types'

export const filesMessagesFr: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Erreur lors du téléchargement des fichiers',
      unexpectedError: 'Erreur inattendue',
      deletionFailed: 'Erreur lors de la suppression des fichiers'
    },
    success: {
      completed: 'Les fichiers ont été téléchargés avec succès',
      list: 'Les fichiers ont été listés avec succès',
      deleted: 'Fichiers supprimés avec succès'
    },
    warning: {
      notFound: 'Fichiers introuvables',
      notFoundToDelete: 'Aucun fichier à supprimer trouvé',
      notDeleted: "Les fichiers n'ont pas pu être supprimés",
      notRetrieved: "Les fichiers n'ont pas pu être récupérés",
      notFoundSearch:
        'Aucun fichier trouvé correspondant aux critères de recherche',
      notMore: 'Plus de fichiers à afficher'
    }
  },
  file: {
    error: {
      deletionFailed: 'Erreur lors de la suppression du fichier'
    },
    success: {
      deleted: 'Fichier supprimé avec succès'
    },
    warning: {
      notFound: 'Fichier introuvable',
      notDeleted: "Le fichier n'a pas pu être supprimé",
      notRetrieved: "Le fichier n'a pas pu être récupéré",
      notMatch: 'Type de fichier non autorisé'
    }
  },
  validation: {
    idFiles: {
      isRequired: "L'ID du fichier est requis",
      isString: "L'ID du fichier doit être une chaîne de caractères",
      isArray: "L'ID du fichier doit être un tableau"
    }
  }
}
