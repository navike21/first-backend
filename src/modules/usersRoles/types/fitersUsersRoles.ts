import { ECollectionState } from '../../../common'

export type TFiltersUserRoles = {
  name?: string
  role?: string
  state?: ECollectionState
}

export type TSortUsersRoles = {
  [k in keyof TFiltersUserRoles]?: 1 | -1
}
