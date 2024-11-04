import { IMessages, IValidationSchema } from '../../../common'

export type TFilesMessage = {
  files: IMessages
  file: IMessages
  validation: TValidationSchemaFiles
}

export type TValidationSchemaFiles = {
  idFiles: IValidationSchema
}
