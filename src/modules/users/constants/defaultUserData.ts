import { ECollectionState } from '../../../common'
import { IUser } from '../types'

export const defaultUserData: IUser = {
  documentId: '',
  email: '',
  fatherLastName: '',
  image: '',
  motherLastName: '',
  name: '',
  password: '',
  phone: '',
  dateOfBirth: '',
  role: [],
  createdAt: new Date(),
  updatedAt: '',
  state: ECollectionState.ACTIVE,
  userConfig: {
    language: '',
    themeBrowser: '',
    alias: ''
  }
}
