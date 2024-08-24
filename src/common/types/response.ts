import { EOperationStatus } from '../enums'

export interface IResponse {
  status: EOperationStatus
  message: string
  data?: object
}
