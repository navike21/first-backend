import { Schema } from 'mongoose'
import { EActions } from '../../../common'

const actionsSchema = new Schema(
  {
    [EActions.CREATE]: { type: Boolean, default: false },
    [EActions.READ]: { type: Boolean, default: false },
    [EActions.UPDATE]: { type: Boolean, default: false },
    [EActions.DELETE]: { type: Boolean, default: false },
    [EActions.RESTORE]: { type: Boolean, default: false },
    [EActions.DELETE_PERMANENTLY]: { type: Boolean, default: false }
  },
  { _id: false }
)

export const systemModulesSchema = new Schema(
  {
    products: {
      type: actionsSchema,
      default: {}
    }
  },
  { _id: false }
)
