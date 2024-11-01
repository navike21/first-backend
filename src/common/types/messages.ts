export interface IMessages {
  success?: ISuccessMessages
  error?: IErrorMessages
  warning?: IWarningMessages
}

export interface ISuccessMessages {
  completed?: string
  created?: string
  deleted?: string
  found?: string
  list?: string
  retrieved?: string
  search?: string
  updated?: string
}

export interface IErrorMessages {
  creationFailed?: string
  updateFailed?: string
  deletionFailed?: string
  retrievalFailed?: string
  listFailed?: string
  searchFailed?: string
  validationFailed?: string
  duplicate?: string
  connectionError?: string
  databaseError?: string
  unexpectedError?: string
  queryFailed?: string
}

export interface IWarningMessages {
  notFound?: string
  notUpdated?: string
  notDeleted?: string
  notRetrieved?: string
  notListed?: string
  notFoundSearch?: string
  notMore?: string
  isEmpty?: string
  notMatch?: string
  isBlocked?: string
  isInactive?: string
  isExpired?: string
}
