import { ECollectionState } from '../../../common'

export type TFiltersUsers = {
  documentId?: string
  email?: string
  createdAt?: string
  fatherLastName?: string
  motherLastName?: string
  names?: string
  state?: ECollectionState
}

export type TSortUsers = {
  [k in keyof TFiltersUsers]?: 1 | -1
}
