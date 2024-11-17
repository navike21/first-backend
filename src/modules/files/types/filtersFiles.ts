import { ECollectionState } from '../../../common'

export type TFiltersFiles = {
  state?: ECollectionState
  mimeType: string
}

export type TSortFiles = {
  [k in keyof TFiltersFiles]?: 1 | -1
}
