import { Schema } from 'mongoose'
import { IUserRole } from '../types'
import { DE, EN, ES, FR, IT, JP, KO, PT } from '../../../common'
import { systemModulesSchema } from './systemModules'

const languages = [DE, EN, ES, FR, IT, JP, KO, PT] as const

const nameSchemaDefinition: Record<
  string,
  { type: StringConstructor; required: boolean; default: string }
> = {}

languages.forEach(lang => {
  nameSchemaDefinition[lang] = { type: String, required: false, default: '' }
})

const nameSchema = new Schema(nameSchemaDefinition, { _id: false })

export const userRoleModelSchema = new Schema<IUserRole>(
  {
    name: {
      type: nameSchema,
      required: true
    },
    idRole: { type: String, required: true, unique: true },
    role: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    systemModules: {
      type: systemModulesSchema,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)
