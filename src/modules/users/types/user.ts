import { ECollectionState } from '../../../common'

export interface IUser {
  documentId: string
  email: string
  fatherLastName: string
  image: string
  motherLastName: string
  name: string
  password: string
  phone: string
  dateOfBirth: Date | string
  role?: string[]
  createdAt?: Date
  updatedAt?: Date | string
  state?: ECollectionState
  userConfig?: IUserConfig
}

export interface IUserConfig {
  language: string
  themeBrowser: 'light' | 'dark' | ''
  alias: string
}
