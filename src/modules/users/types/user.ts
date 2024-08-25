import { ECollectionState, EUserStatus } from '../../../common'

export interface IUser {
  auth: IUserAuth
  config: IUserConfig
  createdAt: Date
  dateOfBirth: Date | string
  documentId: string
  email: string
  fatherLastName: string
  image: string
  motherLastName: string
  names: string
  phone: string
  public_id: string
  state: ECollectionState
  lastModified: Date | string
}

export interface IUserAuth {
  password: string
  status: EUserStatus
}

export interface IUserConfig {
  language: string
  role: string[]
  themeBrowser: 'light' | 'dark' | 'auto'
  userAlias: string
}

export type TUserOmitted = Omit<
  IUser,
  'public_id' | 'createdAt' | 'lastModified' | 'state' | 'config' | 'auth'
>
