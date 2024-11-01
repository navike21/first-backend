import { TUserAuthMessage } from '../../types'

export const authMessagesFr: TUserAuthMessage = {
  password: {
    success: {
      updated: 'Mot de passe mis à jour avec succès',
      created: 'Mot de passe créé avec succès',
      retrieved: 'Mot de passe récupéré avec succès'
    },
    error: {
      updateFailed: 'Erreur lors de la mise à jour du mot de passe',
      creationFailed: 'Erreur lors de la création du mot de passe',
      retrievalFailed: 'Erreur lors de la récupération du mot de passe',
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
  },
  login: {
    success: {
      completed: 'Connexion réussie'
    },
    error: {
      validationFailed: 'Erreur de validation lors de la connexion',
      unexpectedError: 'Erreur inattendue lors de la connexion'
    },
    warning: {
      notMatch: 'Mot de passe incorrect',
      isBlocked: "L'utilisateur est bloqué",
      notFound: "L'utilisateur n'est pas enregistré"
    },
    email: {
      isEmail: "L'email doit être une adresse valide",
      isRequired: "L'email est requis",
      isString: "L'email doit être une chaîne de caractères"
    },
    password: {
      isString: 'Le mot de passe doit être une chaîne de caractères',
      isRequired: 'Le mot de passe est requis',
      minLength: 'Le mot de passe doit comporter au moins 6 caractères',
      isMissing: 'Le mot de passe est non enregistré'
    }
  },
  session: {
    token: {
      isString: 'Le jeton doit être une chaîne de caractères',
      isRequired: 'Le jeton est requis',
      isMissing: 'Jeton non trouvé',
      isMatch: 'Le jeton est invalide'
    },
    validation: {
      success: {
        completed: 'Session validée avec succès'
      },
      error: {
        validationFailed: 'Erreur de validation de la session',
        unexpectedError: 'Erreur inattendue lors de la validation de la session'
      },
      warning: {
        notMatch: 'Session invalide',
        isExpired: 'Le jeton de session a expiré'
      }
    }
  }
}
