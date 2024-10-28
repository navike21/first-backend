import { TUserAuthMessage } from '../../types'

export const authMessagesFr: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Mot de passe mis à jour avec succès',
      created: 'Mot de passe créé avec succès',
      retrieved: 'Mot de passe récupéré avec succès'
    },
    error: {
      updateFailed: 'Échec de la mise à jour du mot de passe',
      creationFailed: 'Échec de la création du mot de passe',
      retrievalFailed: 'Échec de la récupération du mot de passe',
      validationFailed: 'Erreur de validation',
      unexpectedError: 'Erreur inattendue'
    },
    warning: {
      notMatch: 'Les mots de passe ne correspondent pas',
      isEmpty: 'Le mot de passe ne peut pas être vide'
    },
    validation: {
      isString: 'Le mot de passe doit être une chaîne de caractères',
      isRequired: 'Le mot de passe est requis'
    }
  }
}
