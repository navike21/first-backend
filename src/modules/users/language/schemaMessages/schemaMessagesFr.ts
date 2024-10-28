import { TUserSchemaMessage } from '../../types'

export const schemaMessagesFr: TUserSchemaMessage = {
  documentId: {
    isString: "Le document d'identité doit être une chaîne de caractères",
    minLength: "Le document d'identité doit contenir au moins 8 caractères",
    maxLength: "Le document d'identité doit contenir au maximum 8 caractères",
    isRequired: "Le document d'identité est obligatoire"
  },
  email: {
    isString: "L'adresse e-mail doit être une chaîne de caractères",
    isEmail: "L'adresse e-mail doit être valide",
    isRequired: "L'adresse e-mail est obligatoire"
  },
  fatherLastName: {
    isString: 'Le nom de famille du père doit être une chaîne de caractères',
    minLength: 'Le nom de famille du père doit contenir au moins 2 caractères',
    maxLength:
      'Le nom de famille du père doit contenir au maximum 50 caractères',
    isRequired: 'Le nom de famille du père est obligatoire'
  },
  image: {
    isString: "L'URL de l'image doit être une chaîne de caractères",
    isUrl: "L'URL de l'image doit être valide"
  },
  motherLastName: {
    isString: 'Le nom de famille de la mère doit être une chaîne de caractères',
    minLength:
      'Le nom de famille de la mère doit contenir au moins 2 caractères',
    maxLength:
      'Le nom de famille de la mère doit contenir au maximum 50 caractères',
    isRequired: 'Le nom de famille de la mère est obligatoire'
  },
  names: {
    isString: 'Le prénom doit être une chaîne de caractères',
    minLength: 'Le prénom doit contenir au moins 2 caractères',
    maxLength: 'Le prénom doit contenir au maximum 50 caractères',
    isRequired: 'Le prénom est obligatoire'
  },
  phone: {
    isString: 'Le numéro de téléphone doit être une chaîne de caractères',
    minLength: 'Le numéro de téléphone doit contenir au moins 7 caractères',
    maxLength: 'Le numéro de téléphone doit contenir au maximum 15 caractères'
  },
  dateOfBirth: {
    isDate: 'La date de naissance doit être une date valide'
  }
}
