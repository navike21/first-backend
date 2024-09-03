import { IMessages } from '../../../../common'

export const updatePasswordMessagesFr: IMessages = {
  success: {
    updated: 'Mot de passe mis à jour avec succès'
  },
  warning: {
    notUpdated: 'Impossible de mettre à jour le mot de passe',
    notMatch: 'Les mots de passe ne correspondent pas'
  },
  error: {
    updateFailed: 'Erreur lors de la mise à jour du mot de passe',
    unexpectedError: 'Erreur inattendue'
  }
}
