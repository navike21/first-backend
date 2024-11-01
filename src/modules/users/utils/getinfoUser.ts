import { ECollectionState } from '../../../common'
import { UserModel } from '../models'
import { IUser } from '../types'

type TUserSearchCriteria = { email?: string; publicId?: string }

export const getInfoUser = async (
  criteria: TUserSearchCriteria
): Promise<IUser | null> => {
  const existingUser = await UserModel.findOne(criteria, {
    _id: 0
  }).lean<IUser>()

  return existingUser && existingUser.state !== ECollectionState.DELETED
    ? existingUser
    : null
}
