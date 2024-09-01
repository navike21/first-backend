import { ECollectionState, EThemeBrowser, EUserStatus, generateId } from '../../../common'
import { IUser } from '../types'

export const defaultUserData: Omit<IUser, 'lastModified'> = {
  auth: {
    password: '',
    status: EUserStatus.OFFLINE
  },
  config: {
    language: '',
    role: [],
    themeBrowser: EThemeBrowser.AUTO,
    userAlias: ''
  },
  createdAt: new Date(),
  dateOfBirth: '',
  documentId: '',
  email: '',
  fatherLastName: '',
  image: '',
  motherLastName: '',
  names: '',
  phone: '',
  publicId: generateId(),
  state: ECollectionState.ACTIVE
}
