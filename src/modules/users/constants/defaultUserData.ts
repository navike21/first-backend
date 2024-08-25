import { ECollectionState, EUserStatus, generateId } from '../../../common'
import { IUser } from '../types'

export const defaultUserData: IUser = {
  auth: {
    password: '',
    status: EUserStatus.OFFLINE
  },
  config: {
    language: '',
    role: [],
    themeBrowser: 'auto',
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
  public_id: generateId(),
  state: ECollectionState.ACTIVE,
  lastModified: ''
}
