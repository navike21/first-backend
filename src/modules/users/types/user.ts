import { ECollectionState, EThemeBrowser, EUserStatus } from '../../../common'
import { Document } from 'mongoose'

export interface IUser {
  auth: IUserAuth
  config: IUserConfig
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
}

export interface IUserDocument extends IUser, Document {}

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
