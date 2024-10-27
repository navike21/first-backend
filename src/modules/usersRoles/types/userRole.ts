import { Document } from 'mongoose'
import { EActions, ECollectionState, TLanguage } from '../../../common'

type TDescriptionLanguage = {
  [key in TLanguage]: string
}

type TSystemModules = {
  [key: string]: TActions
}

type TActions = {
  [key in EActions]: boolean
}

export interface IUserRole {
  name: TDescriptionLanguage
  idRole: string
  role: string
  state: ECollectionState
  systemModules: TSystemModules
}

export interface IUserRolesDocument extends IUserRole, Document {}

export type TUserRoleOmitted = Omit<IUserRole, 'idRole' | 'state'>
