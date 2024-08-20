import { EStatus } from '../enums'

export interface IResponse {
  status: EStatus
  message: string
  data?: object
}
