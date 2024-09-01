import { TUserSchemaMessage } from '../../types'

export const schemaMessagesFr: TUserSchemaMessage = {
  documentId: {
    isString: "Le document d'identité doit être une chaîne",
    minLength: "Le document d'identité doit contenir au moins 8 caractères",
    maxLength: "Le document d'identité ne doit pas dépasser 8 caractères",
    isRequired: "Le document d'identité est obligatoire"
  },
  email: {
    isString: "L'email doit être une chaîne",
    isEmail: "L'email doit être valide",
    isRequired: "L'email est obligatoire"
  },
  fatherLastName: {
    isString: 'Le nom de famille du père doit être une chaîne',
    minLength: 'Le nom de famille du père doit contenir au moins 2 caractères',
    maxLength: 'Le nom de famille du père ne doit pas dépasser 50 caractères',
    isRequired: 'Le nom de famille du père est obligatoire'
  },
  image: {
    isString: "L'URL de l'image doit être une chaîne",
    isUrl: "L'URL de l'image doit être valide"
  },
  motherLastName: {
    isString: 'Le nom de famille de la mère doit être une chaîne',
    minLength: 'Le nom de famille de la mère doit contenir au moins 2 caractères',
    maxLength: 'Le nom de famille de la mère ne doit pas dépasser 50 caractères',
    isRequired: 'Le nom de famille de la mère est obligatoire'
  },
  names: {
    isString: 'Le prénom doit être une chaîne',
    minLength: 'Le prénom doit contenir au moins 2 caractères',
    maxLength: 'Le prénom ne doit pas dépasser 50 caractères',
    isRequired: 'Le prénom est obligatoire'
  },
  phone: {
    isString: 'Le téléphone doit être une chaîne',
    minLength: 'Le téléphone doit contenir au moins 7 caractères',
    maxLength: 'Le téléphone ne doit pas dépasser 15 caractères'
  },
  dateOfBirth: {
    isDate: 'La date de naissance doit être une date'
  }
}
