import { ECollectionState, EThemeBrowser, EUserStatus } from '../../../common'

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
  publicId: string
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
  themeBrowser: EThemeBrowser
  userAlias: string
}

export type TUserOmitted = Omit<
  IUser,
  'publicId' | 'createdAt' | 'lastModified' | 'state' | 'config' | 'auth'
>
